import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BASE_URL from "../utils/config";

const SetupRoom = () => {
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const res = await fetch(`${BASE_URL}/create-room`, {
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
      const res = await fetch(`${BASE_URL}/join-room/${roomID}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(90,10,150,0.3)_10%,_transparent_80%)] blur-3xl opacity-30"></div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-gray-800/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400">
          Join or Create a Room
        </h1>
        <p className="text-gray-300 text-center mt-2">
          Enter a Room ID to join or create a new room.
        </p>

        {/* Input Field */}
        <motion.input
          type="text"
          placeholder="Enter Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          className="mt-4 w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
          whileFocus={{ scale: 1.05 }}
        />

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-6">
          <motion.button
            onClick={joinRoom}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Room
          </motion.button>

          <div className="text-center text-gray-400">OR</div>

          <motion.button
            onClick={createRoom}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create New Room
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupRoom;
