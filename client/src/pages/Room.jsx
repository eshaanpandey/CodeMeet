import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";

const Room = () => {
  const { roomID } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const username = "User-" + Math.floor(Math.random() * 1000);

  return (
    <div className="flex h-screen">
      <Sidebar
        setActiveTab={setActiveTab}
        roomId={roomID}
        username={username}
      />
      {activeTab === "code" && (
        <CodeEditor roomId={roomID} username={username} />
      )}
      {activeTab === "users" && (
        <div className="p-4 text-white">User List View</div>
      )}
    </div>
  );
};

export default Room;
