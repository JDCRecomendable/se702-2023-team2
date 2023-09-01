import getUserMedia from "getusermedia";
import Peer from "simple-peer";

let peer;

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

  peer.on("error", (err) => console.error(`Error in peer: ${err}`));

  peer.on("signal", (data) => {
    console.log(`Signal event fired: ${data}`);
    document.getElementById("yourId").value = JSON.stringify(data);
  });

  document.getElementById("connect").addEventListener("click", () => {
    const otherId = JSON.parse(document.getElementById("otherId").value);
    peer.signal(otherId);
  });

  peer.on("stream", (stream) => {
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = stream;
  });
});
