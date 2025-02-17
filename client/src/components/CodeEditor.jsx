import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import socket from "../utils/socket";

const CodeEditor = ({ roomId, username }) => {
  const [code, setCode] = useState("// Start coding...");
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newSocket = socket(roomId);
    newSocket.onopen = () => console.log("Connected to WebSocket");

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.username !== username) {
        setCode(data.content);
        setHighlightedUser(data.username); // Show user editing
        setTimeout(() => setHighlightedUser(null), 2000); // Remove after 2s
      }
    };

    setWs(newSocket);

    return () => newSocket.close();
  }, [roomId, username]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (ws) {
      ws.send(JSON.stringify({ room_id: roomId, username, content: newCode }));
    }
  };

  return (
    <div className="w-5/6 p-4">
      {highlightedUser && (
        <div className="text-sm text-gray-600 mb-2">
          ✨ {highlightedUser} is editing...
        </div>
      )}
      <CodeMirror
        value={code}
        height="400px"
        extensions={[javascript()]}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeEditor;
