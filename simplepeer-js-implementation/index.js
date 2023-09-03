import Peer from "simple-peer";

const MESSAGE_TIMEOUT = 3000;

let ws;
let peer;
let messageBuffer = [];  // Buffer for incoming messages

// initialize the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    console.log("Connected to the signaling server");

    if (location.hash === "#init") {
      ws.send(JSON.stringify({ type: 'initiator' }));
    }

    initializePeer();
    showConnectionStatus(true);
  };

  ws.onmessage = (message) => {
    if (!peer) {
      messageBuffer.push(message);
      return;
    }
    processMessage(message);
  };

  // Handle the send button click event
  const sendButton = document.getElementById("sendButton");
  const yourMessage = document.getElementById("yourMessage");
  const messages = document.getElementById("messages");

  sendButton.addEventListener("click", () => {
    const message = yourMessage.value;
    sendMessage(message);
  });
});

const initializePeer = () => {
  // Using the modern API and promises
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      const localVideo = document.getElementById("localVideo");
      localVideo.srcObject = stream;

      // sourcing the div inside which the canvas is displayed
      const canvasContainer = document.getElementById("canvasContainer");

      // append the canvas to the parent div
      canvasContainer.appendChild(canvas);

      // canvas config
      // setting the size of the canvas as the same as the video stream from the webcam
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      canvas.width = settings.width;
      canvas.height = settings.height;

      // Draw video onto canvas
      const drawVideo = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scale the video. Change 1, 1 to other values to zoom in/out.
        ctx.setTransform(1.25, 0, 0, 1.25, 0, 0);

        ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideo);
      };

      drawVideo();

      // framerate of the canvas stream
      const canvasStream = canvas.captureStream(30);

      peer = new Peer({
        initiator: location.hash === "#init",
        trickle: false,
        stream,
      });

      // Process any buffered messages
      while (messageBuffer.length > 0) {
        processMessage(messageBuffer.shift());
      }

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

      // New event handler for receiving data
      peer.on("data", (data) => {
        const message = data.toString();
        const messages = document.getElementById("messages");
        messages.innerHTML += `<p>Other: ${message}</p>`;
      });

    })
    .catch(err => {
      console.error(`Error in getUserMedia: ${err.message}`);
    });
};

const processMessage = (message) => {
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

// Function to send text message to peer
const sendMessage = (message) => {
  const messages = document.getElementById("messages");
  peer.send(message);
  messages.innerHTML += `<p>You: ${message}</p>`;
};
