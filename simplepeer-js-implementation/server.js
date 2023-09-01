const WebSocket = require('ws');

/**
 * Signal server simple implementation to establish the connection between the two peers.
 * After the initial connection is established, the signal server is not used further.
 */
const wss = new WebSocket.Server({ port: 8080 });

console.log("signal server running...");

wss.on('connection', ws => {
  ws.on('message', message => {

    // it simply broadcasts the message sent by one peer to all other peers.
    // Only text messages are required.
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
