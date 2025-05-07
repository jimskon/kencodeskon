"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import InteractiveTerminal from "../terminal";

export default function SingleFileEditorClient({ session }) {
  const termRef = useRef();
  const resizerRef = useRef(null);
  const [code, setCode] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [language, setLanguage] = useState("python");
  const [editorHeight, setEditorHeight] = useState("60vh");
  const [terminalHeight, setTerminalHeight] = useState("30vh");
  const [isResizing, setIsResizing] = useState(false);

  // Attach unload listener once
  useEffect(() => {
    const onUnload = () => {
      try {
        navigator.sendBeacon("/api/eval");
      } catch {
        // Fallback synchronous XHR
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api/eval", false);
        xhr.send(null);
      }
    };
    window.addEventListener("unload", onUnload);
    return () => window.removeEventListener("unload", onUnload);
  }, []);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Setup terminal resize handlers
  useEffect(() => {
    const handleMouseDown = () => {
      setIsResizing(true);
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      // Calculate container height (viewport height minus top elements)
      const containerHeight = window.innerHeight - 200; // Adjust based on your layout
      
      // Calculate cursor position relative to the window
      const cursorPosition = window.innerHeight - e.clientY;
      
      // Set min/max limits for terminal (between 15% and 85% of container)
      const minTerminalHeight = containerHeight * 0.15;
      const maxTerminalHeight = containerHeight * 0.85;
      
      // Clamp terminal height between min and max
      const newTerminalHeight = Math.max(
        minTerminalHeight,
        Math.min(maxTerminalHeight, cursorPosition)
      );
      
      // Calculate editor height as the remaining space
      const newEditorHeight = containerHeight - newTerminalHeight;
      
      // Update heights as vh units
      setTerminalHeight(`${(newTerminalHeight / window.innerHeight) * 100}vh`);
      setEditorHeight(`${(newEditorHeight / window.innerHeight) * 100}vh`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const resizer = resizerRef.current;
    if (resizer) {
      resizer.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (resizer) {
        resizer.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handles the cloning of repositories in github
  const handleClone = async () => {
    try {
      const repoUrl = prompt("Enter GitHub Repo URL to clone:");
      if (repoUrl) {
        termRef.current.sendInput(`git clone ${repoUrl}\n`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePull = async () => {
    try {
      termRef.current.sendInput("git pull\n");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePush = async () => {
    try {
      const message = prompt("Enter commit message:") || "Update files";
      termRef.current.sendInput(`git add .\ngit commit -m "${message}"\ngit push\n`);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCode = (newValue) => {
    setCode(newValue || "");
  };

  const getDefaultComment = () => {
    if (language === "python") {
      return `# Hey There, Welcome to KenCode!!\n# Excited to Code? Get Started Here`;
    }
    if (language === "cpp") {
      return `// Hey There, Welcome to KenCode!!\n// Excited to Code? Get Started Here`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await fetch("/api/eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, session }),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      console.log(json.output);
      termRef.current.sendInput(json.output);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleTerminalSize = () => {
    if (isTerminalMaximized) {
      // Return to previous sizes
      setEditorHeight("60vh");
      setTerminalHeight("30vh");
    } else {
      // Maximize terminal
      setEditorHeight("10vh");
      setTerminalHeight("60vh");
    }
    setIsTerminalMaximized(!isTerminalMaximized);
  };

  const clearTerminal = () => {
    if (termRef.current) {
      termRef.current.sendInput("clear\n");
    }
  };

  return ( 
    <div className={`editor-container h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="language" className="mr-2 font-semibold">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`form-select px-3 py-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-3 py-1 rounded-md flex items-center ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
        <div className="relative flex-grow" style={{ height: editorHeight }}>
          <Editor
            height="100%"
            language={language}
            defaultValue={getDefaultComment()}
            onChange={updateCode}
            theme={isDarkMode ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
          
          {/* Fixed Run button positioning */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              type="submit"
              className="bg-blue-600 text-white flex items-center justify-center font-semibold py-2 px-6 rounded-md hover:bg-blue-700 shadow-lg"
            >
              <span className="mr-1">▶</span> Run
            </button>
          </div>
        </div>

        {/* Resizer handle */}
        <div 
          ref={resizerRef}
          className={`cursor-row-resize h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-blue-500 flex items-center justify-center`}
        >
          <div className="w-12 h-1 rounded-full bg-gray-500"></div>
        </div>

        <div className="terminal-container flex flex-col" style={{ height: terminalHeight }}>
          <div className={`flex justify-between items-center p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <h2 className="font-bold text-lg">Terminal</h2>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={clearTerminal}
                className={`px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                Clear {/*New clear Button to clear the terminal*/}
              </button>
              <button
                type="button"
                onClick={toggleTerminalSize}
                className={`px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                {isTerminalMaximized ? 'Minimize' : 'Maximize'}
              </button>
            </div>
          </div>

          <div className={`flex justify-end gap-2 p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <button
              type="button"
              onClick={handleClone}
              className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
            >
              Clone Repo
            </button>
            <button
              type="button"
              onClick={handlePull}
              className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white"
            >
              Pull Changes
            </button>
            <button
              type="button"
              onClick={handlePush}
              className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Push Changes
            </button>
          </div>

          {/* Terminal content container with explicit scrolling */}
          <div className="flex-grow overflow-hidden">
            <div className="h-full overflow-y-auto" style={{ maxHeight: "calc(100% - 4px)" }}>
              <InteractiveTerminal
                ref={termRef}
                isDarkMode={isDarkMode}
                className={`terminal-content w-full ${isDarkMode ? 'bg-black' : 'bg-white'}`}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
