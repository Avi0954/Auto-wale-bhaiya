import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

let activeUsers = 0;

function broadcastCount() {
  const message = JSON.stringify({ type: 'COUNT_UPDATE', count: activeUsers });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  activeUsers++;
  console.log(`User connected. Total active: ${activeUsers}`);
  
  // Immediately send the current count to the new user
  ws.send(JSON.stringify({ type: 'COUNT_UPDATE', count: activeUsers }));
  
  // Broadcast to all other users
  broadcastCount();

  // Heartbeat mechanism to clean up stale connections
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', () => {
    activeUsers--;
    console.log(`User disconnected. Total active: ${activeUsers}`);
    broadcastCount();
  });
});

// Ping interval to check for broken connections
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

console.log(`Live Passenger WebSocket server running on port ${port}`);
