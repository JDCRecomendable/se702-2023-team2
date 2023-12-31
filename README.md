# Project
Implementation of a Webrtc video conferencing application using SimplePeer framework.
The Implementation uses vanilla JS, HTML, and CSS for the implementation. No additional frameworks are used. 
However, the backend JS code and the signal server requires the npm package manager and node.

## Features and Functionality
The application has the following functionalities (complete version in the main branch): 
- Able to establish a connection across different devices by following the instructions using mobile hotspot and by entering in the IP address of the host client/device in the input field in the home screen. As well as have a local device playback connection with localhost (enter localhost into the input field instead, more detailed instructions are provided further below).
- Emoticon sidebar which allows users to express their emotions using advanced emojis, to inform the presenter of how they are feeling. The number of times each emoji is sent is accrued and displayed in an aggregated format.
- Zoom functionality for their video feed, able to zoom in and out. As well as pan the camera across the primary x and y axis to allow fine-grained control of what part of their video feed they want visible.
- Peer-to-peer text chat to communicate with the other person in the call through text messages. This is in real-time and full duplex.
- Can set your display name as anonymous or set a custom name. Depending on your privacy preference.
- Able to turn off your video stream or mute your mic through the two mute buttons on the meeting page.
- Able to reset the aggregated display showing the emoticon sidebar emojis sent to you by the other participants.
- Log statistics generated and printed to the developer console in an aggregated format outlining the frequency of the user's interaction with the various interactive features in the application such as the emoticon sidebar and zoom affordances.

## GitHub URL
```https://github.com/JDCRecomendable/se702-2023-team2.git```

## Required Dependencies and system specifications
To run this project it is required that the device has npm and node installed. 
To check if you have the above two technologies installed enter the following two commands into a terminal:
```npm -v```
then: 
```node -v```
If either of the above two commands throw an error, this means that it is not installed. 

Also please ensure that you have Google Chrome browser installed and if you are connecting the application across separate devices, you have access to at least one Windows machine.
It would also be optimal for the node and npm installations to be the latest stable version(s). As it might be that the application runs incorrectly on older versions.

## Changes in the Implementation from the Project Plan
- The zoom affordance scope has been expanded to include panning functionality in across both the x and y axis. The affordance in the project plan was limited to the zoom bar.
- Added the Print log statistics functionality to generate objective data after discussion with Gerald Weber, to supplement the data collected from the questionnaire with objective data from the application itself.
- Ease of life functionality: Added mute video and audio buttons, to allow participants to disable and enable the streams in the study.
- Instead of having only two permutations/versions: 1) Base video and chat function and 2) base version + all affordances. Now the emoticon sidebar has been excluded from the participant study so that collected data is not conflated between multiple versions and to increase the validity of the study. Therefore at present the two permutations used in the study are: 1) Base version: Video + chat 2) Zoom functionality. The emoticon side bar will be assessed separately through a sub-study using the Cognitive Dimensions of Notations.

## Project Structure
- The main branch is the complete version of the application with all affordances: base video and chat functionality + zoom and panning + emoticon sidebar
- BRANCH-NO-SIDEBAR-NO-ZOOM is the base version of the application without any affordances.
- BRANCH-NO-SIDEBAR is the version with the zoom and panning affordance.

The branches are used as permutations during the research study with participants, the emoticons sidebar is excluded from the human participant study aspect of the project.

## Technologies and dependencies used in the project
- SimplePeer WebRTC
- Webpack (Bundling js files)
- WebSockets
- Node
- npm (package manager)


## Instructions to Run 

### Initial setup 
Clone the repo from GitHub and navigate to the root level of the project directory in your terminal.
Enter the command ```npm install``` to install the required dependencies from the project.json file. 

### Booting up the application locally on your device
Now open up another terminal, and make sure that the current path of the second terminal is also at the root level of the project directory. 
Currently, you should have two terminals open. 

In the first terminal, enter the following command to run the signal server: 
```npm run signal``` 
In the second terminal, enter the following command to run the application: 
```npm run start```

Next open up two browser windows side by side, please make sure you use Google Chrome, as Simple Peer may not be compatible with other browsers.
Your signal server should start at port 8080. Check the console output in the terminal in which you had entered ```npm run start```, it will tell you the port number 
the application is running at. More likely than not the port number will be 8081.

Assuming that it is 8081: 
In the first browser window navigate to the following URL: 
```http://localhost:8081/home```
In the second browser window also navigate to the same URL: 
```http://localhost:8081/home```

You will see the following screen: 
![homepage-702](https://github.com/JDCRecomendable/se702-2023-team2/assets/79944764/d5d8f9c5-21b6-4828-8ac1-315124add977)

In the first browser window click on the 'Start' button directly. 
In the second browser window enter '''localhost''' into the input field and then click on 'Join' button.

You will notice that the application changes to a different screen: 
The browser window with localhost:8081/#init as the url is the initiating peer of the connection. 
The browser window with the URL localhost:8081 is the non-initiator.

Since you are running the application locally on your device and not across two different devices, the initiating browser window simulates you and the non-initiator window simulates the other person in the call.

This is what the meeting screen will look like: 
![meeting-page-702](https://github.com/JDCRecomendable/se702-2023-team2/assets/79944764/0dd57834-17b7-4876-af50-b025310fe522)

### Running the application across two devices 
If there are two devices are connected on the same network as the signal server then the application can be run across two separate devices using mobile hotspot. This is the method in which the study was conducted 
with participants.

First of all, you need two devices, one of the devices needs to be a Windows machine for mobile hotspot to work. 
On the Windows machine or one of the devices (if both are Windows) open up mobile hotspot, through 'Network & Internet' > 'Mobile hotspot'. There might be different network bands available, make sure you choose a band that 
is compatible for your devices, most likely 2GHz. 

Once the mobile hotspot is up and running, on the second device find and connect to the mobile hotspot in the wifi tab.

Once the connection has been established, you can follow the same steps to run the application. But this time the device that is hosting the mobile hotspot needs to run the signal server and one browser. 
The other device does not need to start up another instance of a signal server and can just run '''npm run start''' and boot up the application. Note: on the second device, since port 8080 is not being occupied by the signal server, 
the application will likely start on 8080 instead of 8081, meaning the URL is likely: 
```http://localhost:8080/home```

Once the application is running on both devices and you are on the /home page for both of them:
In the second device/non-initiating device instead of entering 'localhost' into the input field, enter the IP address of the network that the host device is running the mobile hotspot on. 
The IP address needs to be for that network specifically, not your public IP address sourced from the internet and it must be the IPv4 address. 

You can find this through entering: 
```ipconfig```
In the terminal of the hosting device. 



