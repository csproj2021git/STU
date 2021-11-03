const socket = io("/");
const videoGrid = document.getElementById("videos_grid");
const myVideoWindow = document.createElement("video");
const peers = {};
myVideoWindow.muted = true;
var myVideoStream;
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

//On start, we join classroom
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  getVideoAudio();
});

function getVideoAudio() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideoWindow, stream);
    });
}

//Recieve request to connect to peer
peer.on("call", (call) => {
  call.answer(myVideoStream);
  if (!peers[call.peer]) {
    connecToNewUser(call.peer, myVideoStream);
  }
});

//Send new peer request to connect
socket.on("user-connected", (userId) => {
  setTimeout(connecToNewUser, 1000, userId, myVideoStream); // to success to answer
});

//Connecting to new user peer.
const connecToNewUser = (userId, stream) => {
  //We are calling new user and sending him our stream
  const call = peer.call(userId, stream);
  peers[userId] = call;
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
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

//Auto scroll down in chat
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

//Close and open chat bar
var chat_off = false;
const chatOnChatOff = () => {
  if (!chat_off) {
    chat_off = true;
    $(".main_left").css("flex", "1");
    $(".main_right").css({ flex: "0", display: "none" });
  } else {
    chat_off = false;
    $(".main_left").css("flex", "0.8");
    $(".main_right").css({ flex: "0.2", display: "" });
  }
};

// display the user that disconnected:
let mainRightWidth = $(".main_right").width() + 10;
let dcMessageTag = $(".disconnect_message");
let start_opacity = parseFloat(dcMessageTag.css("opacity")); // Trying to get the initial opacity configured in the .css file.

const dcPopup = (userId) => {
  let dcMessageItself = $(".dc_msg_itself");
  dcMessageTag.css({
    right: String(mainRightWidth) + "px",
    display: "block",
    visibility: "visible",
    opacity: start_opacity,
  });
  dcMessageItself.text(userId + " has disconnected");
  setTimeout(
    function (tag) {
      var opacity = start_opacity;
      const IntervalId = setInterval(
        () => {
          opacity -= 0.1;
          if (opacity > 0) {
            tag.css("opacity", String(opacity));
          } else {
            tag.css("opacity", 0);
            tag.css({ display: "none", visibility: "hidden" });
            clearInterval(IntervalId);
          }
        },
        50,
        tag
      );
    },
    1800,
    dcMessageTag
  );
};

const leavingMeetingButtonClicked = () => {
  location.href = "leaving_the_room.html"; // redirect and come back to home page!
};

// share screen:
const shareButtonClicked = () => {
  navigator.mediaDevices
    .getDisplayMedia({ cursor: true })
    .then((mediaStream) => {
      var video = document.querySelector("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = (e) => {
        video.play();
        getUserMediaSuccess(video.srcObject);
      };
    });
};

// when press enter send message
$("html").keydown((e) => {
  let text = $("input");
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit("message", text.val());
    text.val("");
  }
});

// Message recieved event handler
socket.on("createMessage", (message, time_rn) => {
  $("ul").append(`
    <li class="message">
      <b>user</b>
      <br>
      <div class="msg">
        ${message}
      </div>
      <div class="msg_timestamp">
        ${time_rn}
      </div>
    </li>`);
  scrollToBottom();
});

// When user disconnects, we disconnect from him
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
    dcPopup(userId);
  }
});
