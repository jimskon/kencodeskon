'use client';

import React, {useRef} from 'react'
import Editor, { OnChange } from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import styled from "@emotion/styled";
import InteractiveTerminal from '@/app/editor/terminal';
interface CodeProps {
  selectedFile?: File;
  session: string;
}

export const Code: React.FC<CodeProps> = ({ selectedFile, session }) => {
  if (!selectedFile) return null;

  const termRef = useRef<any>(null);
  const initialCode = selectedFile.content;
  let language = selectedFile.name.split('.').pop();

  if (language === "js" || language === "jsx") {
    language = "javascript";
  } else if (language === "ts" || language === "tsx") {
    language = "typescript";
  }

  const handleChange: OnChange = (value) => {
    // only send update if we have content
    if (value === undefined) return;

    fetch('/api/filetree', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: selectedFile.path,
        content: value,
        session: session
      })
    })
    .catch(console.error);
  };

  const handleRun = () => {
    const path = selectedFile.path;
    // remove file from end to get folder
    const projectdir = path.split('/').slice(0,-1).join('/');
    if (path.endsWith('.py') || path.endsWith('.cpp')) {
      let command;
      if (path.endsWith('.py')){
        command = `python ${path}\n`
      } else if (path.endsWith('.cpp')){
        const exepath = path.split('.').slice(0,-1).join('.')+'.exe'
        command = `cd ${projectdir} && (make && ./main) && cd ~ || g++ ${path} -o ${exepath} && ${exepath} && cd ~\n`
      }
      termRef.current.sendInput(command);
    }
  }
  return (
    <EditorContainer>
      <Editor
        height="40vh"
        language={language}
        value={initialCode}
        theme="vs-dark"
        onChange={handleChange}
      />
      <button onClick={handleRun}>Run</button>
      <InteractiveTerminal ref={termRef} />
    </EditorContainer>
  );
}

const EditorContainer = styled.div`
  width: calc(100% - 250px);
  height: 50vh;
  margin: 0;
  font-size: 16px;
`;
