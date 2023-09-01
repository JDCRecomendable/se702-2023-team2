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

### To run:
1. Start the signal server with ```npm run signal```.
2. Start the application with ```npm run start```.
3. Open two browsers: localhost:8081/#init in one browser and localhost:8081 in the second browser. *
4. The browser with /#init appended to url is your client, the other one simulates the other peer.

### Note: 
* The signal server will run at port 8080, that means when you go ```npm run start```. Therefore, the application will likely run at next available which is 8081. 
But that might not be the case, so check the console.log statements for what port it opens at.
