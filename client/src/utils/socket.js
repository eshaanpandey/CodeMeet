export default function socket(roomID, username) {
  const ws = new WebSocket(`ws://localhost:8080/ws/code/${roomID}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", username }));
  };

  return ws;
}
