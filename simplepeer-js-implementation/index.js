import Peer from "simple-peer";

const MESSAGE_TIMEOUT = 3000;

let ws;
let peer;
let messageBuffer = [];  // Buffer for incoming messages

// initialize the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

// declaring variables for the zoom of stream in x and y direction 
let zoom = 1.25;

document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8080");

  // listening for any change in the sliders in ui
  const zoomSlider = document.getElementById("zoomX");

  zoomSlider.addEventListener("input", (event) => {
    zoom = parseFloat(event.target.value);
  });

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
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      // local and remote video div elements
      const localVideo = document.getElementById("localVideo");
      const remoteVideo = document.getElementById("remoteVideo");

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

      // Draw video onto canvas, with zoom based on the slider values for the x and y direction
      const drawVideo = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Use zoomX and zoomY variables
        ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
      
        ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideo);
      };

      drawVideo();

      // framerate of the canvas stream
      const canvasStream = canvas.captureStream(30);

      // initiate the video streaming, the browser with /#init appended to the url is the initiating browser
      peer = new Peer({
        initiator: location.hash === "#init",
        trickle: false,
        stream: canvasStream,
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

// Handles emoji button clicks
const tooltipContainers = document.querySelectorAll('.tooltip-container');
const resetButton = document.getElementById('reset-button');

tooltipContainers.forEach((container) => {
  const button = container.querySelector('.emoji-button');
  const tooltipText = container.querySelector('.tooltip-text');
  const progressFill = container.querySelector('.progress-fill');

  let clickCount = 0;

  button.addEventListener("click", (event) => {
    clickCount++;

    // Update progress bar - max width is 10 clicks
    const maxWidth = 10;
    const width = Math.min((clickCount / maxWidth) * 100, 100);
    progressFill.style.width = width + '%';

    // Update tooltip text
    tooltipText.textContent = `Clicked: ${clickCount}`;
    button.parentElement.classList.add("active");

    // TODO: Send emoji to peer - currently just logs to console
    const emoji = event.target.textContent;
    console.log(`clicked ${emoji}`);
  });

  // Reset count and progress bar on reset button click
  resetButton.addEventListener("click", () => {
    clickCount = 0;
    tooltipText.textContent = `Clicked: ${clickCount}`;
    progressFill.style.width = '0%';
    button.parentElement.classList.remove("active");
  });
});

// Function to send text message to peer
const sendMessage = (message) => {
  const messages = document.getElementById("messages");
  peer.send(message);
  messages.innerHTML += `<p>You: ${message}</p>`;
};
