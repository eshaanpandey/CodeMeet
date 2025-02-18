import BASE_URL from "./config";

export default function socket(roomID, username) {
  const ws = new WebSocket(
    `${BASE_URL.replace("https", "wss")}/ws/code/${roomID}`
  );

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", username }));
  };

  return ws;
}
