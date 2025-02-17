export default function socket(roomID, username) {
  //   const ws = new WebSocket(`ws://localhost:8080/ws/code/${roomID}`);
  const ws = new WebSocket(
    `wss://codemeet-zzlo.onrender.com/ws/code/${roomID}`
  );

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", username }));
  };

  return ws;
}
