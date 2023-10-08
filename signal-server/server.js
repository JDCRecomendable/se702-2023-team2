const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let pendingInitiatorData = []; // To hold the initial signaling messages from the initiator

console.log("signal server running...");

wss.on('connection', ws => {
  ws.on('message', message => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'initiator') {
      ws.isInitiator = true;
      return;
    }
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    if (ws.isInitiator) {
      pendingInitiatorData.push(message);
    }
  });

  ws.on('close', () => {
    if (ws.isInitiator) {
      pendingInitiatorData.length = 0;
    }
  });

  if (!ws.isInitiator) {
    for (const message of pendingInitiatorData) {
      ws.send(message);
    }
  }
});
