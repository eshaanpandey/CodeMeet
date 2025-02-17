import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetupRoom = () => {
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const res = await fetch("http://localhost:8080/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.room_id) {
        navigate(`/room/${data.room_id}`);
      } else {
        alert("Failed to create room. Try again.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Server error. Try again later.");
    }
  };

  const joinRoom = async () => {
    if (!roomID.trim()) {
      alert("Enter a Room ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/join-room/${roomID}`);
      const data = await res.json();

      if (data.error) {
        alert("Room not found!");
      } else {
        navigate(`/room/${roomID}`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button onClick={createRoom} className="px-4 py-2 bg-blue-500 text-white">
        Create Room
      </button>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        className="px-2 py-1 border"
      />
      <button onClick={joinRoom} className="px-4 py-2 bg-green-500 text-white">
        Join Room
      </button>
    </div>
  );
};

export default SetupRoom;
