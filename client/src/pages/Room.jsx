import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";
import VideoCall from "../components/VideoCall";
import Chat from "../components/Chat";
import UserList from "../components/UserList";

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

      {activeTab === "video" && (
        <VideoCall roomId={roomID} username={username} />
      )}

      {activeTab === "chat" && <Chat roomId={roomID} username={username} />}

      {activeTab === "users" && (
        <UserList roomId={roomID} username={username} />
      )}
    </div>
  );
};

export default Room;
