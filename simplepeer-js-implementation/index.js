import getUserMedia from "getusermedia";
import Peer from "simple-peer";

const MESSAGE_TIMEOUT = 3000;

let ws;
let peer;

// Wait for the DOM to load before initializing WebSocket and Peer connections
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8080"); // Connect to signaling server at port 8080

  ws.onopen = () => {
    console.log("Connected to the signaling server");
    initializePeer();
    showConnectionStatus(true);
  };

  ws.onmessage = (message) => {
    if (message.data instanceof Blob) {
      const reader = new FileReader();
      reader.readAsText(message.data);
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        peer.signal(data);
      };
    } else {
      const data = JSON.parse(message.data);
      peer.signal(data);
    }
  };
});

const initializePeer = () => {
  getUserMedia({ video: true, audio: false }, (err, stream) => {
    if (err) {
      console.error(`Error in getUserMedia: ${err}`);
      return;
    }

    const localVideo = document.getElementById("localVideo");
    localVideo.srcObject = stream;

    peer = new Peer({
      initiator: location.hash === "#init",
      trickle: false,
      stream,
    });

    peer.on("error", (err) => {
      console.error(`Error in peer: ${err}`);
      showConnectionStatus(false);
    });

    peer.on("signal", (data) => {
      ws.send(JSON.stringify(data));
    });

    peer.on("stream", (stream) => {
      const remoteVideo = document.getElementById("remoteVideo");
      remoteVideo.srcObject = stream;
    });
  });
};

const showConnectionStatus = (successful) => {
  const connectionStatusDiv = document.querySelector(".connection-success");

  if (successful) {
    connectionStatusDiv.style.backgroundColor = "green";
    connectionStatusDiv.innerHTML = "<p>Connection successful!</p>";
  } else {
    connectionStatusDiv.style.backgroundColor = "red";
    connectionStatusDiv.innerHTML = "<p>Connection failed!</p>";
  }

  connectionStatusDiv.style.display = "block";

  setTimeout(() => {
    connectionStatusDiv.style.display = "none";
  }, MESSAGE_TIMEOUT);
};

// Handles emoji button clicks
const emojiContainer = document.getElementById('emoji-container');

emojiContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const emoji = event.target.textContent;
    // TODO: replace with actual logic
    console.log(`clicked ${emoji}`);
  }
});