const socket = io("/");
const videoGrid = document.getElementById("videos_grid");
const myVideoWindow = document.createElement("video");
const peers = {};
myVideoWindow.muted = true;
var myVideoStream;
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3001",
});
//On start, we join classroom

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  getVideoAudio();
});

function getVideoAudio() {
  navigator.mediaDevices
    .getDisplayMedia({})
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideoWindow, myVideoStream);
    })
    .catch(() => {
      myVideoStream = new MediaStream();
      addVideoStream(myVideoWindow, myVideoStream);
    });
}

//Recieve request to connect to peer
peer.on("call", (call) => {
  console.log("Hello?");
  call.answer(myVideoStream);
  if (!peers[call.peer]) {
    connecToNewUser(call.peer, myVideoStream);
  }
});

//Send new peer request to connect
socket.on("user-connected", (userId) => {
  setTimeout(connecToNewUser, 5000, userId, myVideoStream); // to success to answer
});

//Connecting to new user peer.
const connecToNewUser = (userId, stream) => {
  //We are calling new user and sending him our stream
  console.log(`Lets call ${userId}`);
  const call = peer.call(userId, stream);
  console.log(`Succesfully called ${call.peer}`);
  peers[userId] = call;
  const video = document.createElement("video");
  addVideoStream(
    video,
    new MediaStream([call.peerConnection.getReceivers()[0].track])
  );
  call.on("close", () => {
    video.remove();
  });
};

//Add stream into our own page
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // document.createElement("image")
  videoGrid.append(video);
};

// When user disconnects, we disconnect from him
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});
