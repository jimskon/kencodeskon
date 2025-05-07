import { NextResponse } from 'next/server';


export async function validateRequest(req: Request) {
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Unsupported Media Type' },
      { status: 415 }
    );
  }

  const data = await req.json();
  console.log(data);
  // Validate the payload format
  if (!data || typeof data !== 'object') {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  } else {
    return data
  }
}