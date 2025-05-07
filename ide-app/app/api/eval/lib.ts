import { NextResponse } from 'next/server';
import { Evaluator } from '@/evaluator/evaluator'
import { Docker } from '@/evaluator/docker';
import { decrypt } from '@/lib';

export async function evaluateCode(code:string, language:string, dockerid:string){
  console.log('Received payload:', { language, code, dockerid });

  // Initialize the evaluator with the correct language
  const evaluator = new Evaluator();
  let output;

  try {
    // Evaluate the code
    output = await evaluator.simplyEvaluate(code, language, dockerid);
  } catch (err: unknown) {
    console.error('Error during code evaluation:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Error during code evaluation',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 });
  }

  let cstatus = output.hasOwnProperty('err') ? 'error' : 'success';

  return NextResponse.json({
    status: 'success',
    containerStatus: cstatus,
    output: output,
    timestamp: new Date().toISOString()
  });
}

export async function evaluateFile(filepath:string, dockerid:string){
  var docker = new Docker();
    docker.setParams(dockerid);
  try {
    var output = await docker.runFile(filepath);
    let cstatus = output.hasOwnProperty('err') ? 'error' : 'success';
    return NextResponse.json({
      status: 'success',
      containerStatus: cstatus,
      output: output,
      timestamp: new Date().toISOString()
    });
  } catch(err: unknown) {
    console.error('Error during code evaluation:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Error during code evaluation',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 });
  }

}
