import React, { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";

const UserList = ({ roomId, username }) => {
  const [users, setUsers] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = socket(roomId, username);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected for user list");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "users") {
          console.log("Received user list update:", data.users);
          setUsers(data.users);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket closed. Reconnecting in 2 seconds...");
        setUsers([]); // Clear users on disconnect
        setTimeout(connectWebSocket, 2000); // Reconnect after 2 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, username]);

  return (
    <div className="p-4 text-white">
      <h2 className="text-lg font-bold">Active Users</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => (
            <li key={index} className="py-1">
              {user}
            </li>
          ))
        ) : (
          <li className="py-1 text-gray-400">No active users</li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
