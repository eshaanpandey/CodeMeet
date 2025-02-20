import React, { useEffect, useRef, useState } from "react";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import BASE_URL from "../utils/config";

const serverURL = `${BASE_URL.replace("https", "wss")}/ws/video/`;

const VideoCall = ({ roomId }) => {
  const [peers, setPeers] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const localStream = useRef(null);
  const localVideoRef = useRef();
  const peerConnections = useRef({});
  const wsRef = useRef(null);
  const userID = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    wsRef.current = new WebSocket(
      `${serverURL}${roomId}?userID=${userID.current}`
    );

    wsRef.current.onopen = () => console.log("Connected to WebSocket");

    wsRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Received message:", data);

      switch (data.type) {
        case "new-peer":
          handleNewPeer(data.userID);
          break;
        case "offer":
          handleOffer(data.userID, data.offer);
          break;
        case "answer":
          handleAnswer(data.userID, data.answer);
          break;
        case "ice-candidate":
          handleIceCandidate(data.userID, data.candidate);
          break;
        case "peer-left":
          handlePeerLeft(data.userID);
          break;
      }
    };

    wsRef.current.onclose = () => console.log("WebSocket closed");

    startVideoStream();

    return () => {
      wsRef.current?.close();
      Object.values(peerConnections.current).forEach((peer) => peer.close());
      setPeers([]);
    };
  }, [roomId]);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const handleNewPeer = async (newUserID) => {
    if (newUserID === userID.current || peerConnections.current[newUserID])
      return;

    const peer = createPeerConnection(newUserID);
    peerConnections.current[newUserID] = peer;
    setPeers((prev) => [...prev, { userID: newUserID, stream: null }]);

    createOffer(newUserID);
  };

  const createPeerConnection = (newUserID) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStream.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStream.current);
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        safeSend({
          type: "ice-candidate",
          userID: newUserID,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      setPeers((prev) =>
        prev.map((p) =>
          p.userID === newUserID ? { ...p, stream: event.streams[0] } : p
        )
      );
    };

    return peer;
  };

  const createOffer = async (newUserID) => {
    const peer = peerConnections.current[newUserID];
    if (!peer) return;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    safeSend({ type: "offer", userID: newUserID, offer });
  };

  const handleOffer = async (newUserID, offer) => {
    if (peerConnections.current[newUserID]) return;

    const peer = createPeerConnection(newUserID);
    peerConnections.current[newUserID] = peer;
    setPeers((prev) => [...prev, { userID: newUserID, stream: null }]);

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    safeSend({ type: "answer", userID: newUserID, answer });
  };

  const handleAnswer = async (newUserID, answer) => {
    const peer = peerConnections.current[newUserID];
    if (peer?.signalingState !== "stable") {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = (newUserID, candidate) => {
    const peer = peerConnections.current[newUserID];
    if (peer) {
      peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    }
  };

  const handlePeerLeft = (leftUserID) => {
    if (peerConnections.current[leftUserID]) {
      peerConnections.current[leftUserID].close();
      delete peerConnections.current[leftUserID];
    }
    setPeers((prev) => prev.filter((p) => p.userID !== leftUserID));
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const safeSend = (data) => {
    try {
      wsRef.current?.send(JSON.stringify(data));
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-4">Video Call Room: {roomId}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="rounded-lg shadow-lg border-2 border-blue-500"
        />

        {peers.map(({ userID, stream }) =>
          stream ? (
            <video
              key={userID}
              ref={(ref) => ref && (ref.srcObject = stream)}
              autoPlay
              playsInline
              className="rounded-lg shadow-lg border-2 border-green-500"
            />
          ) : null
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={toggleVideo}
          className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          {videoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </button>

        <button
          onClick={toggleAudio}
          className="p-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          {audioEnabled ? (
            <FaMicrophone size={24} />
          ) : (
            <FaMicrophoneSlash size={24} />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
