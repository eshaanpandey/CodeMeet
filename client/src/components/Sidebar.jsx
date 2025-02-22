import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socket from "../utils/socket";

const Sidebar = ({ setActiveTab, roomId }) => {
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ws = socket(roomId);
    ws.onopen = () => console.log("Sidebar connected to WebSocket");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "members") {
        setMembers(data.members);
      }
    };

    return () => ws.close();
  }, [roomId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
    copied = true;
  };

  return (
    <div className="w-1/6 bg-gray-900 text-white p-4 h-full flex flex-col">
      <button
        onClick={() => setActiveTab("code")}
        className="p-3 hover:bg-gray-700"
      >
        Code
      </button>
      <button
        onClick={() => setActiveTab("video")}
        className="p-3 hover:bg-gray-700"
      >
        Video
      </button>
      <button
        onClick={() => setActiveTab("chat")}
        className="p-3 hover:bg-gray-700"
      >
        Chat
      </button>
      <button
        onClick={() => setActiveTab("users")}
        className="p-3 hover:bg-gray-700"
      >
        Users
      </button>
      {/* <button
        onClick={() => setActiveTab("screen")}
        className="p-3 hover:bg-gray-700"
      >
        Screen Share
      </button> */}

      <div className="p-3 mt-4 bg-gray-800 rounded-lg flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-sm text-gray-400">Room ID:</p>
          <p className="text-white font-semibold">{roomId}</p>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-300 hover:text-white"
        >
          {/* <Copy size={24} weight="bold" /> */}
          {/* <FontAwesomeIcon icon="fa-solid fa-clipboard" /> */}
        </button>
      </div>

      {/* Copy Confirmation Message */}
      {copied && (
        <p className="text-green-400 text-xs text-center mt-2">
          Room ID copied!
        </p>
      )}
    </div>
  );
};

export default Sidebar;
