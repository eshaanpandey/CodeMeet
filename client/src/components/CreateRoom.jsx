import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    const response = await fetch("http://localhost:8080/create-room", {
      method: "POST",
    });
    const data = await response.json();
    navigate(`/room/${data.room_id}`);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <button
        onClick={createRoom}
        className="p-4 bg-blue-500 text-white rounded"
      >
        Create Room
      </button>
      <input
        type="text"
        placeholder="Enter Room ID"
        className="mt-4 p-2 border"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        onClick={() => navigate(`/room/${roomId}`)}
        className="p-4 bg-green-500 text-white rounded mt-2"
      >
        Join Room
      </button>
    </div>
  );
};

export default CreateRoom;
