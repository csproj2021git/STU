const socket = io("/");
const videoGrid = document.getElementById("videos_grid"); // get the element by id
const myVideo = document.createElement("video"); // create video element
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "7678",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    // access to the devices
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream); // add my video stream
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream); // add user video stream
      });
    });

    socket.on("user-connected", (userId) => {
      setTimeout(connecToNewUser, 1000, userId, stream); // to success to answer
    });

    // input value
    let text = $("input");
    // when press enter send message
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });
    socket.on("createMessage", (message) => {
      $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connecToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  var d = $(".main_chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

// mute our voice
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

// mute our video
const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

// change the icon on click
const setMuteButton = () => {
  const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
  document.querySelector(".main_mute_button").innerHTML = html;
};
// change the icon on click
const setUnmuteButton = () => {
  const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
  document.querySelector(".main_mute_button").innerHTML = html;
};

// change the icon on click
const setStopVideo = () => {
  const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
  document.querySelector(".main_video_button").innerHTML = html;
};
// change the icon on click
const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
  document.querySelector(".main_video_button").innerHTML = html;
};
