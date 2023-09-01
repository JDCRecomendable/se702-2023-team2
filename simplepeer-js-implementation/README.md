# Project
Implementation of a webrtc video conferencing application using SimplePeer framework. The project uses npm and vanillaJS.

## Version 1
There is no signal server, so the connection between the initiator and the other peer is made by manually copying the id to and from. 
When a signal server has been created, this will be routed through the signal server and can be done automatically.

## Version 2
There is a simple signal server implementation, first run the signal server:
```npm run signal``` 
then run the application:
```npm run start```
Now there is no longer a need to manually connect the two peers, the signal server takes care of it.

