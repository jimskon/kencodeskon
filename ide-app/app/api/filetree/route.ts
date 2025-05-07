import { NextResponse, NextRequest } from 'next/server'
import { validateRequest } from '../lib'
import { Docker } from '@/evaluator/docker';
// define and export the GET handler function



export async function POST(request: Request) {
    let data;
    try {
        // check response
        var earlyresponse = await validateRequest(request);
        if (earlyresponse.constructor === NextResponse) {
          return earlyresponse;
        } else {
          data = earlyresponse
        }
        console.log("filetree#POST with data:", data);
        const { type, name, session } = data;
        if (!type || !name || !session) {
          return NextResponse.json(
            { error: `Missing required fields: type, name, or session is null. Request: ${JSON.stringify(data)}` },
            { status: 400 }
          );
        }
        
        // process
        const docker = new Docker();
        docker.setParams(session.hashid);
        if (type == "directory")
            docker.containerFileOp(name, "addDirectory");
        else if (type == "file")
            docker.containerFileOp(name, "addFile")
        return NextResponse.json({
            status: 'success',
            message: 'File or directory added successfully'
        });    
    } catch (error: unknown) {
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

export async function GET(request: Request) {
    // let data;
    try {
        // // check response
        // var earlyresponse = await validateRequest(request);
        // if (earlyresponse.constructor === NextResponse) {
        //   return earlyresponse;
        // } else {
        //   data = earlyresponse
        // }
        const { searchParams } = new URL(request.url);
        console.log(searchParams);
        const session = searchParams.get('session');
        const name = searchParams.get('name');
        const type = searchParams.get('type');

        if (!session || !name || !type) {
          return NextResponse.json(
            { error: `Missing required fields: type, name, or session is null. Request: ${{type, name, session}}` },
            { status: 400 }
          );
        }
        // process
        const docker = new Docker();
        docker.setParams(session);
        let data;
        if (type == "directory") {
            data = await docker.readDirectoryFiles(name);
        } else if (type == "file") {
            data = await docker.containerFileOp(name, "getFile");
        }
        console.log(data)
        return NextResponse.json({
            status: 'success',
            message: 'File or directory retrieved successfully',
            data: data
        });
    } catch (error: unknown) {
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

export async function PATCH(request: Request) {
  let data;
    try {
        // check response
        var earlyresponse = await validateRequest(request);
        if (earlyresponse.constructor === NextResponse) {
          return earlyresponse;
        } else {
          data = earlyresponse
        }
        console.log("filetree#UPDATE with data:", data);
        const { session } = data;
        if (!session) {
          return NextResponse.json(
            { error: `Missing required fields: session is null. Request: ${JSON.stringify(data)}` },
            { status: 400 }
          );
        }
        // process
        const docker = new Docker();
        docker.setParams(session.hashid);
        const fulltree = docker.getTree();
        const treedata = await fulltree;
        return NextResponse.json({
            status: 'success',
            message: 'read files in tree successfully',
            data: treedata
        });
    } catch (error: unknown) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                error: 'Error processing request'
            },
            { status: 500 }
        )
    }
};

export async function PUT(request: Request) {
  let data;
    try {
        // check response
        var earlyresponse = await validateRequest(request);
        if (earlyresponse.constructor === NextResponse) {
          return earlyresponse;
        } else {
          data = earlyresponse
        }
        console.log("filetree#PUT with data:", data);
        const { name, content, session } = data;
        if (!name || !content || !session) {
          return NextResponse.json(
            { error: `Missing required fields: session is null. Request: ${JSON.stringify(data)}` },
            { status: 400 }
          );
        }
        // process
        const docker = new Docker();
        docker.setParams(session);
        docker.updateFile(name, content);
        return NextResponse.json({
            status: 'success',
            message: 'file updated'
        });
    } catch (error: unknown) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                error: 'Error processing request'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
  let data;
  try {
    // check response
    var earlyresponse = await validateRequest(request);
    if (earlyresponse.constructor === NextResponse) {
      return earlyresponse;
    } else {
      data = earlyresponse
    }
    console.log("filetree#POST with data:", data);
    const { type, name, session } = data;
    if (!type || !name || !session) {
      return NextResponse.json(
        { error: `Missing required fields: type, name, or session is null. Request: ${JSON.stringify(data)}` },
        { status: 400 }
      );
    }

    const docker = new Docker();
    docker.setParams(session);
    let output;
    if (type == "directory") {
      output = docker.containerFileOp(name, "deleteDirectory");
    } else if (type == "file") {
      output = docker.containerFileOp(name, "deleteFile");
    }

    const msg = type.charAt(0).toUpperCase() + type.slice(1);
    return NextResponse.json({
      status: 'success',
      message: `${msg} '${name}' deleted successfully`
  });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
        {
            error: 'Error processing request'
        },
        { status: 500 }
    )
  }
}