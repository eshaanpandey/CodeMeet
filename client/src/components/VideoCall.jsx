import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import BASE_URL from "../utils/config";

const VideoCall = ({ roomId }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeers, setRemotePeers] = useState({});
  const [stream, setStream] = useState(null);
  const videoGridRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `${BASE_URL.replace("https", "wss")}/ws/video/${roomId}`
    );

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      socketRef.current.send(JSON.stringify({ type: "join", peerId: id }));
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        addVideoStream(stream, "local");

        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            addVideoStream(remoteStream, call.peer);
          });
        });

        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "new-peer" && data.peerId !== peerId) {
            const call = peer.call(data.peerId, stream);
            call.on("stream", (remoteStream) => {
              addVideoStream(remoteStream, data.peerId);
            });
          }
        };
      });

    return () => {
      peer.disconnect();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [roomId]);

  const addVideoStream = (stream, id) => {
    if (!remotePeers[id]) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.id = `video-${id}`;
      video.className = "w-1/3 h-auto border-2 border-white";

      videoGridRef.current.appendChild(video);
      setRemotePeers((prev) => ({ ...prev, [id]: true }));
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "video") track.enabled = !track.enabled;
      });
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") track.enabled = !track.enabled;
      });
    }
  };

  const stopVideoCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 text-white h-full">
      <h2 className="text-lg font-bold mb-2">Video Call</h2>
      <div className="flex gap-2">
        <button onClick={toggleVideo} className="px-4 py-2 bg-blue-500 rounded">
          Toggle Video
        </button>
        <button
          onClick={toggleAudio}
          className="px-4 py-2 bg-green-500 rounded"
        >
          Toggle Audio
        </button>
        <button
          onClick={stopVideoCall}
          className="px-4 py-2 bg-red-500 rounded"
        >
          Stop Call
        </button>
      </div>
      <div ref={videoGridRef} className="flex flex-wrap gap-4 mt-4"></div>
    </div>
  );
};

export default VideoCall;
