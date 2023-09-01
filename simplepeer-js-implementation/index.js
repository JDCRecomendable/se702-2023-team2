import getUserMedia from 'getusermedia';
import Peer from 'simple-peer';

let ws;
let peer;

// Wait for the DOM to load before initializing WebSocket and Peer connections
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket('ws://localhost:8080'); // Connect to signaling server at port 8080
  
  ws.onopen = () => {
    console.log('Connected to the signaling server');
    // Initialize peer only after WebSocket connection is established
    initializePeer();
  };
  
  // message received from signal server as blob, parsing to text
  ws.onmessage = message => {
    if (message.data instanceof Blob) {
      const reader = new FileReader();
      reader.readAsText(message.data);
      reader.onload = function() {
        const data = JSON.parse(reader.result);
        peer.signal(data);
      };
    } else {
      const data = JSON.parse(message.data);
      peer.signal(data);
    }
  };
  
});

function initializePeer() {
  getUserMedia({ video: true, audio: false }, (err, stream) => {
    if (err) {
      console.error(`Error in getUserMedia: ${err}`);
      return;
    }
  
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
  
    peer = new Peer({
      initiator: location.hash === '#init',
      trickle: false,
      stream,
    });
  
    peer.on('error', err => console.error(`Error in peer: ${err}`));
  
    peer.on('signal', data => {
      ws.send(JSON.stringify(data)); // Send signal data when WebSocket is ready
    });
  
    peer.on('stream', stream => {
      const remoteVideo = document.getElementById('remoteVideo');
      remoteVideo.srcObject = stream;
    });
  });
}
