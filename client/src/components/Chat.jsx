import React, { useEffect, useRef, useState } from "react";

const Chat = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // const socket = new WebSocket(
    //   `ws://localhost:8080/ws/chat/${roomId}?username=${username}`
    // );

    const socket = new WebSocket(
      `wss:/codemeet-zzlo.onrender.com/ws/chat/${roomId}?username=${username}`
    );

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]);
    };

    setWs(socket);

    return () => socket.close();
  }, [roomId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (ws && message.trim() !== "") {
      const msg = { username, message };
      ws.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-gray-50">
      <div className="flex-1 overflow-y-auto border border-gray-300 rounded-xl p-5 bg-white shadow-lg">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.username === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.username === username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="font-semibold text-sm">{msg.username}</span>
                <p className="text-base mt-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <span className="font-semibold">Send</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
