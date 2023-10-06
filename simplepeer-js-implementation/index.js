import Peer from "simple-peer";

const MESSAGE_TIMEOUT = 3000;

// Mic and camera toggle buttons
const toggleMicButton = document.getElementById("mic-button");
const toggleCameraButton = document.getElementById("camera-button");

// Video stream buttons
const panLeftButton = document.getElementById("pan-left-button");
const panRightButton = document.getElementById("pan-right-button");
const panUpButton = document.getElementById("pan-up-button");
const panDownButton = document.getElementById("pan-down-button");

// Home screen components
const joinButton = document.getElementById("joinButton");
const startButton = document.getElementById("initButton");
const serverInput = document.querySelector(".ip-input");

// nav bar buttons
const statsButton = document.querySelector(".stats-button");
const homeButton = document.querySelector(".home-button");
const settingsButton = document.querySelector(".settings-button");

// modal settings window
const settingsModalOverlay = document.getElementById("settingsModalOverlay");
const closeModal = document.getElementById("closeModal");

let ws;
let peer;
let messageBuffer = []; // Buffer for incoming messages

let displayName = "Anonymous";

let interactionRecords = {
  smileyEmojiButton: [],
  skullEmojiButton: [],
  heartEmojiButton: [],
  thumbsUpEmojiButton: [],
  thumbsDownEmojiButton: [],
  homeButton: [],
  settingsButton: [],
  sendButton: [],
  zoomSlider: [],
  panUpButton: [],
  panDownButton: [],
  panLeftButton: [],
  panRightButton: [],
  micButton: [],
  cameraButton: [],
}; // Datetime records of interactions with the GUI

// initialize the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

// declaring variables for the zoom of stream in x and y direction
let cameraZoom = 1.25;
let cameraXOffset = 0;
let cameraYOffset = 0;

// Home screen event listeners
if (window.location.pathname === "/home") {
  joinButton.addEventListener("click", function () {
    const serverURL = serverInput.value.trim();
    if (serverURL) {
      window.location.href = `/${serverURL}`;
    }
  });

  startButton.addEventListener("click", function () {
    window.location.href = "/#init";
  });
} else {
  let toggleVideo = true;
  let toggleAudio = true;

  // event listeners for toggling the mic and camera buttons
  toggleMicButton.addEventListener("click", () => {
    const stream = peer.streams[0];
    const audioTracks = stream.getAudioTracks();
    interactionRecords.micButton.push(new Date());

    audioTracks.forEach((track) => {
      track.enabled = !track.enabled; // Toggle microphone

      if (toggleAudio) {
        toggleMicButton.style.background = "#FF0000";
      } else {
        toggleMicButton.style.background = "#879ceb";
      }

      toggleAudio = !toggleAudio;
    });
  });

  toggleCameraButton.addEventListener("click", () => {
    const stream = peer.streams[0];
    const videoTracks = stream.getVideoTracks();
    interactionRecords.cameraButton.push(new Date());

    videoTracks.forEach((track) => {
      track.enabled = !track.enabled; // Toggle camera

      if (toggleVideo) {
        toggleCameraButton.style.background = "#FF0000";
      } else {
        toggleCameraButton.style.background = "#879ceb";  
      }

      toggleVideo = !toggleVideo; // Corrected this line
    });
  });

  // event listeners for panning the video stream
  let panTimer;

  panLeftButton.addEventListener("mousedown", () => {
    interactionRecords.panLeftButton.push(new Date());
    panTimer = setInterval(() => {
      cameraXOffset += 4;
    }, 50);
  });

  panLeftButton.addEventListener("mouseup", () => {
    panTimer = clearInterval(panTimer);
  });

  panRightButton.addEventListener("mousedown", () => {
    interactionRecords.panRightButton.push(new Date());
    panTimer = setInterval(() => {
      cameraXOffset -= 4;
    }, 50);
  });

  panRightButton.addEventListener("mouseup", () => {
    panTimer = clearInterval(panTimer);
  });

  panUpButton.addEventListener("mousedown", () => {
    interactionRecords.panUpButton.push(new Date());
    panTimer = setInterval(() => {
      cameraYOffset += 4;
    }, 50);
  });

  panUpButton.addEventListener("mouseup", () => {
    panTimer = clearInterval(panTimer);
  });

  panDownButton.addEventListener("mousedown", () => {
    interactionRecords.panDownButton.push(new Date());
    panTimer = setInterval(() => {
      cameraYOffset -= 4;
    }, 50);
  });

  panDownButton.addEventListener("mouseup", () => {
    panTimer = clearInterval(panTimer);
  });

  // event listeners for the nav bar buttons
  statsButton.addEventListener("click", function () {
    alert(
      "Interaction records printed to JavaScript console as object. \
      Copy the object and paste into a text editor for analysis."
    );
    console.log(interactionRecords);
  });

  homeButton.addEventListener("click", function () {
    window.location.href = "/home";
    console.log("go to home page");
    interactionRecords.homeButton.push(new Date());
  });

  settingsButton.addEventListener("click", function () {
    console.log("open up settings modal");
    interactionRecords.settingsButton.push(new Date());
  });

  // event listeners for toggling the settings modal window on or off

  // show the modal
  settingsButton.addEventListener("click", function () {
    settingsModalOverlay.style.display = "block";
  });

  // hide the modal
  closeModal.addEventListener("click", function () {
    settingsModalOverlay.style.display = "none";
  });

  // toggle the overlay along with the modal
  settingsModalOverlay.addEventListener("click", function (event) {
    if (event.target === settingsModalOverlay) {
      settingsModalOverlay.style.display = "none";
    }
  });

  // Handles changing display name
  const displayNameInput = document.getElementById("displayName");
  const displayNameButton = document.getElementById("changeDisplayName");
  const remainAnonymousToggle = document.getElementById("remainAnonymous");

  displayNameButton.addEventListener("click", () => {
    // If the user wants to remain anonymous or the display name is empty, set the display name to Anonymous
    if (remainAnonymousToggle.checked || displayNameInput.value === "") {
      displayName = "Anonymous";
      displayNameInput.value = "";
      settingsModalOverlay.style.display = "none";
      return;
    }

    // Change the display name
    displayName = displayNameInput.value;
    displayNameInput.value = "";

    // Close the modal
    settingsModalOverlay.style.display = "none";
  });

  document.addEventListener("DOMContentLoaded", () => {
    let url;
    if (location.hash === '#init') {
      url = "/localhost"
    } else {
      url = window.location.pathname;
    }
    ws = new WebSocket(`ws:/${url}:8080`);

    // listening for any change in the sliders in ui
    const zoomSlider = document.getElementById("zoomX");

    // log interaction with zoom slider
    zoomSlider.addEventListener("click", (event) => {
      interactionRecords.zoomSlider.push(new Date());
    });

    zoomSlider.addEventListener("input", (event) => {
      cameraZoom = parseFloat(event.target.value);
    });

    ws.onopen = () => {
      console.log("Connected to the signaling server");

      if (location.hash === "#init") {
        ws.send(JSON.stringify({ type: "initiator" }));
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
      interactionRecords.sendButton.push(new Date());
    });
  });
}

const initializePeer = () => {
  // Using the modern API and promises
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: { echoCancellation: true } })
    .then((stream) => {
      const audioTracks = stream.getAudioTracks();

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
        ctx.setTransform(
          cameraZoom,
          0,
          0,
          cameraZoom,
          (canvas.width * (1 - cameraZoom)) / 2 + cameraXOffset,
          (canvas.height * (1 - cameraZoom)) / 2 + cameraYOffset
        );

        ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideo);
      };

      drawVideo();

      // framerate of the canvas stream
      const canvasStream = canvas.captureStream(30);

      // Add the audio to the canvas stream
      if (audioTracks.length > 0) {
        canvasStream.addTrack(audioTracks[0]);
      }

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

      // receiving text data from peer
      // could be text messages or emoji
      peer.on("data", (data) => {
        const receivedData = JSON.parse(data);
        if (receivedData.type === "message") {
          const message = receivedData.message;
          const messages = document.getElementById("messages");
          messages.innerHTML += `<p>${message}</p>`;
        } else if (receivedData.type === "emoji") {
          const emoji = receivedData.message;
          // Iterate through emoji buttons to find the matching one
          const emojiButtons = document.querySelectorAll(".emoji-button");
          emojiButtons.forEach((emojiButton) => {
            if (emojiButton.textContent === emoji) {
              increaseEmojiCount(emojiButton);
            }
          });
        }
      });
    })
    .catch((err) => {
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
const tooltipContainers = document.querySelectorAll(".tooltip-container");
const resetButton = document.getElementById("reset-button");

tooltipContainers.forEach((container) => {
  const button = container.querySelector(".emoji-button");
  const tooltipText = container.querySelector(".tooltip-text");
  const progressFill = container.querySelector(".progress-fill");

  let clickCount = 0;

  button.addEventListener("click", (event) => {
    increaseEmojiCount(button);

    // Record interaction with button
    const buttonName = button.dataset.name || "";
    if (buttonName !== "" && interactionRecords[buttonName] !== undefined) {
      interactionRecords[buttonName].push(new Date());
    }

    // Send emoji to peer
    const message = event.target.textContent;
    const data = JSON.stringify({ type: "emoji", message });
    peer.send(data);
  });

  // Reset count and progress bar on reset button click
  resetButton.addEventListener("click", () => {
    clickCount = 0;
    tooltipText.textContent = `Clicked: ${clickCount}`;
    progressFill.style.width = "0%";
    button.parentElement.classList.remove("active");
  });
});

// Function to increase emoji count and update progress bar and tooltip
const increaseEmojiCount = (emojiButton) => {
  let clickCount = parseInt(emojiButton.getAttribute("data-click-count")) || 0;
  clickCount++;

  // Update progress bar - max width is 10 clicks
  const maxWidth = 10;
  const width = Math.min((clickCount / maxWidth) * 100, 100);

  // Update tooltip text
  emojiButton.setAttribute("data-click-count", clickCount);
  const tooltipText = emojiButton.parentElement.querySelector(".tooltip-text");
  tooltipText.textContent = `Clicked: ${clickCount}`;

  // Update progress bar width
  const progressFill =
    emojiButton.parentElement.querySelector(".progress-fill");
  progressFill.style.width = `${width}%`;

  // Make emoji button active (visible)
  emojiButton.parentElement.classList.add("active");
};

// Function to send text message to peer
const sendMessage = (message) => {
  // Clear input field
  const messageInput = document.getElementById("yourMessage");
  messageInput.value = "";

  // Send message to peer
  const fullMessage = `${displayName}: ${message}`;
  console.log(`Sending message: ${fullMessage}`);
  const data = JSON.stringify({ type: "message", message: fullMessage });
  peer.send(data);

  // Display message on own screen
  messages.innerHTML += `<p>${displayName}: ${message}</p>`;
};
