import getUserMedia from 'getusermedia';
import Peer from 'simple-peer';

const ws = new WebSocket('ws://localhost:8081');

let peer;

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
    ws.send(JSON.stringify(data));
  });

  ws.onmessage = message => {
    const data = JSON.parse(message.data);
    peer.signal(data);
  };

  peer.on('stream', stream => {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = stream;
  });
});
