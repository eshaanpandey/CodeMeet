import React, { useEffect, useState } from "react";
import socket from "../utils/socket";

const Sidebar = ({ setActiveTab, roomId }) => {
  const [members, setMembers] = useState([]);

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

  return (
    <div className="w-1/6 bg-gray-900 text-white p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">Active Users</h2>
      <ul className="mb-4">
        {members.map((user, index) => (
          <li key={index} className="text-sm text-gray-300 p-1">
            🟢 {user}
          </li>
        ))}
      </ul>

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
        onClick={() => setActiveTab("screen")}
        className="p-3 hover:bg-gray-700"
      >
        Screen Share
      </button>
    </div>
  );
};

export default Sidebar;
