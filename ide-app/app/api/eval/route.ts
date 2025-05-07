import { NextResponse } from 'next/server';
import { Docker } from '@/evaluator/docker';
import { getSession, logout } from '@/lib';
import { validateRequest } from '../lib';
import { evaluateCode, evaluateFile } from './lib';
//* INDEX //
// validateRequest(req: Request)
//   checks basic request details
//
// evaluateCode(code:string, language:string)
//   evaluates the code using the specified language
//
// evaluateFile(filepath:string, dockerid:string)
//   runs the specified file in the docker container
//

// API map (api/eval)
// POST - evaluates standalone code
// GET - evaluates a file
// DELETE - ends a docker container

// Posting creates a new docker container for the user.
export async function POST(req: Request) {
  let data;
  try {
    // Validate incoming request
    var earlyresponse = await validateRequest(req);
    if (earlyresponse.constructor === NextResponse) {
      return earlyresponse;
    } else {
      data = earlyresponse
    }
    console.log(data)
    // Ensure language and code are provided
    const { code, language, session } = data;
    if (!code || !language || !session) {
      return NextResponse.json(
        { error: 'Missing required fields: code or language' },
        { status: 400 }
      );
    }
    console.log("reading variables")

    // Validate the language
    if (!["python", "cpp"].includes(language)) {
      return NextResponse.json(
        { error: 'Unsupported language. Choose "python" or "cpp".' },
        { status: 400 }
      );
    }
    console.log("reading session")
    const docker = session.hashid
    console.log(docker)
    // Evaluate the code
    const response = await evaluateCode(code, language, docker);
    return response;
  } 
  catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Error processing request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET Method only evaluates code
export async function GET(req: Request) {
  let data
  try {
    // Validate incoming request
    var earlyresponse = await validateRequest(req);
    if (earlyresponse.constructor === NextResponse) {
      return earlyresponse;
    } else {
      data = earlyresponse
    }
    // Ensure language and code are provided
    const { filename } = data;
    if (!filename) {
      return NextResponse.json(
        { error: 'Missing required fields: code or language' },
        { status: 400 }
      );
    }
    const session = await getSession();
    console.log(session)
    
    // Evaluate
    return await evaluateFile(filename, session.session.hashid);
  }
  catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Error processing request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  let data;
  try {
    // Validate incoming request
    // Ensure language and code are provided
    logout();
    // return success response
    return NextResponse.json({
      status: 'success',
      message: 'Docker container cleaned up successfully',
    }, { status: 200 });
  }
  catch (error: unknown) {
    console.error("Error cleaning up docker container:", error);
  }
}
