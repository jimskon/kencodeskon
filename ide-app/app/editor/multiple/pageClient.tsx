"use client"
import React, { useState } from "react";
import Sidebar from "@/app/eval/filetree/components/sidebar"
import { Code } from "@/app/eval/filetree/editor/code";
import styled from "@emotion/styled";
import { Type, File, Directory, findFileByName, findFolderById } from "@/app/eval/filetree/utils/file-manager";
// import "./App.css";
import { FileTree } from "@/app/eval/filetree/components/file-tree";
import { buildFileTree } from "@/app/eval/filetree/utils/file-manager";



// export const useFilesFromServer = (id: string, callback: (dir: Directory) => void) => {
//   React.useEffect(() => {
//     const rootdir = buildFileTree(sampleJSON);
//     callback(rootdir);
//     // fetch('https://codesandbox.io/api/v1/sandboxes/' + id)
//     //   .then(response => response.json())
//     //   .then(({data}) => {
//     //     const rootDir = buildFileTree(data);
//     //     callback(rootDir)
//     //   })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])
// }

const dummyDir: Directory = {
  id: "1",
  name: "loading...",
  type: Type.DUMMY,
  path: ".",
  parentId: undefined,
  depth: 0,
  dirs: [],
  files: []
};

interface MultipleFileEditorProps {
  session: any;
  initialTree: object;
}

const NewFileButton = styled.button`
  display: block;
  width: calc(100% - 16px);
  margin: 8px;
  padding: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #2563eb;
  }
`
export default function MultipleFileEditor({
  session,
  initialTree,
}: MultipleFileEditorProps): React.JSX.Element {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<Directory | undefined>();
  // Build tree once on mount
  React.useEffect(() => {
    const tree = buildFileTree(initialTree);
    setRootDir(tree);
    setSelectedFile(findFileByName(tree, 'README.md'));
    console.log(tree)
    setSelectedFolder(tree);
  }, [initialTree]);

  // Event Handlers

  // Update filetree from container
  const handleRefresh = async () => {
    const response = await fetch('/api/filetree', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session:session })
    });
    if (!response.ok) {
      const errorText = await response.text();
      // console.log(response)
      throw new Error(errorText || 'Unknown error');
    }
    const resp = await response.json();
    const tree = buildFileTree(resp.data)
    setRootDir(tree)
  }

  // Load file contents when selected
  const onSelect = async (file: File) => {
    // immediately update selection so Code pane can show a loading state if needed
    setSelectedFile({ ...file, content: "" });

    // build proper query-string URL
    const params = new URLSearchParams({
      type: "file",
      name: file.path,
      session: session.hashid,
    });
    const url = `/api/filetree?${params.toString()}`;
    // console.log("fetching file content from", url);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}: ${res.statusText}`);
      }
      // console.log(res)
      const payload = await res.json();
      const content = payload.data;     // your GET handler should return { data: string }
      // console.log(content)
      // without mutating the original object, create a new one
      const updatedFile: File = { ...file, content };
      setSelectedFile(updatedFile);
      const folder = findFolderById(rootDir,file.parentId)
      if (folder){
        setSelectedFolder(folder);
      }
    } catch (err: any) {
      console.error("Failed to load file:", err);
      // you might show an error in UI as well
      alert("Error loading file: " + err.message);
    }
  };

  const onFolderSelect = (folder: Directory) => {
    // immediately update selection so Code pane can show a loading state if needed
    setSelectedFolder({ ...folder});
    console.log(folder);
    console.log(selectedFolder);
  }
  // Create new file
  const handleCreateFile = async () => {
    const fileName = prompt('Enter new file name:');
    if (!fileName || !fileName.trim()) {
      return;
    }

    try {
      let newFilePath;
      if (selectedFolder) {
        newFilePath = selectedFolder?.path + fileName.trim();
      } else if (selectedFile){
        const index = selectedFile?.path.lastIndexOf("/");
        const parentDir = selectedFile?.path.substring(0, index);
        newFilePath = parentDir + "/" + fileName.trim();
      } else {
        newFilePath = rootDir.path + fileName.trim();
      }
      console.log(newFilePath);
      // console.log(session)
      const response = await fetch('/api/filetree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: "file",name: newFilePath, session: session })
      });
      // console.log(response)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unknown error');
      }

      // Optionally refresh your file list here, e.g. via context or by re-fetching
      alert(`File "${fileName}" created successfully.`);
    } catch (err: any) {
      console.error('Failed to create file:', err);
      alert(`Error creating file: ${err.message}`);
    }
    handleRefresh();
  }

  // Create new folder
  const handleCreateFolder = async () => {
    const folderName = prompt('Enter new folder name:');
    if (!folderName || !folderName.trim()) {
      return;
    }
    try {
      let newFolderPath;
      if (selectedFolder) {
        const parentDir = selectedFolder?.path;
        newFolderPath = parentDir + folderName.trim();
      } else {
        newFolderPath = rootDir.path + folderName.trim();
      }
      // console.log(newFolderPath);
      // console.log(session)
      const response = await fetch('/api/filetree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: "directory",name: newFolderPath, session: session })
      });
      // console.log(response)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unknown error');
      }
    }
    catch (err: any) {
      console.error('Failed to create folder:', err);
      alert(`Error creating folder: ${err.message}`);
    }
    handleRefresh();
  }

  const handleDelete = async (item: File | Directory) => {
    let type;
    if (item.type === Type.DIRECTORY) {
      type = 'directory'
    } else if (item.type === Type.FILE) {
      type = 'file'
    }
    const resp = await fetch('/api/filetree', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: type, name: item.path, session: session.hashid })
    })
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(errorText || 'Unknown error');
    }
    if (selectedFolder?.id === item.id) {
      setSelectedFolder(rootDir)
    } else if (selectedFile?.id === item.id){
      setSelectedFile(undefined)
    } 
    handleRefresh();
    alert(`${type} "${item.name}" deleted successfully.`);
  }
  // console.log("refresh ran")
  return (
    <div style={{display:"flex"}}>
        <Sidebar>
          <NewFileButton onClick={handleCreateFile}>
            + New File
          </NewFileButton>
          <NewFileButton onClick={handleCreateFolder}>+ New Folder</NewFileButton>
          <NewFileButton onClick={handleRefresh}>Refresh</NewFileButton>
          <FileTree 
            rootDir={rootDir} 
            selectedFile={selectedFile} 
            onSelect={onSelect} 
            onFolderSelect={onFolderSelect} 
            onDelete={handleDelete}
          />
        </Sidebar>
        <Code selectedFile={selectedFile} session={session.hashid} />
    </div>
  );

  
}