import { NextResponse } from 'next/server';
import { getSession } from '@/lib';
import { validateRequest } from '../lib';

export async function GET(req: Request) {
  try {
    // Validate incoming request
    // var earlyresponse = await validateRequest(req);
    // if (earlyresponse.constructor === NextResponse) {
    //   return earlyresponse;
    // }
    // Ensure language and code are provided


    const session = await getSession();
    console.log(session);
    
    // Evaluate
    return NextResponse.json({
      status: 'success',
      output: session.hashid,
      timestamp: new Date().toISOString()
    });
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