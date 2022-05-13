const socket = io("/");
const videoGrid = document.getElementById("videos_grid");
const myVideo = document.createElement("video");
const peers = {};
const senders = {}
myVideo.muted = true;
var myVideoStream;
var myShareStream
let ID
let ID_SHARE
let firstShare = []


var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

var peer2 = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});


//On start, we join classroom
peer.on("open", (id_peer) => {
  ID = id_peer
  peer2.on("open",(id_peer2) => {
    socket.emit("join-room", ROOM_ID, id_peer, id_peer2);
    ID_SHARE = id_peer2
  })
});


navigator.mediaDevices.getUserMedia({
  // access to the devices
  video: true,
  audio: true,
}).then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream); // add my video stream
  peer.on("call", (call) => {
    call.answer(stream);
    if (!peers[call.peer]) {
      connectToNewUser(call.peer, stream);
    }
  });
  // input value
  let text = $("input");
  // when press enter send message
  $("html").keydown((e) => {
    if (e.which === 13 && text.val().length !== 0) {
      socket.emit("message", text.val());
      text.val("");
    }
  });

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

  socket.on("user-sharing", (userId) => {
    setTimeout(connectToNewUser, 1000, userId, stream); // to success to answer
  })

  socket.on("ending-share", (mediaStreamId) => {
    console.log("ending-share: ", mediaStreamId)
    var videoList = document.getElementsByTagName("video");
    for (let v of videoList) {
      if (v.srcObject.id === mediaStreamId) {
        v.style.visibility = "hidden"
        v.style.height = "0"
        v.style.width = "0"
      }
    }
  })

  socket.on("user-re-sharing", (mediaStreamId) => {
    var videoList = document.getElementsByTagName("video");
    for (let v of videoList) {
      if (v.srcObject.id === mediaStreamId) {
        v.style.height = "250px"
        v.style.width = "300px"
        v.style.visibility = "visible"
      }
    }
  })

  //When new user connects, we connect to him
  socket.on("user-connected", (userId) => {
    setTimeout(connectToNewUser, 1000, userId, stream); // to success to answer
  });

  // When user disconnects, we disconnect from him
  socket.on("user-disconnected", (userId) => {
    if (peers[userId]) {
      peers[userId].close();
      delete peers[userId];
      dcPopup(userId)
    }
  });

  socket.on("share-disconnected", (shareId) => {
    if (peers[shareId]) {
      peers[shareId].close();
      delete peers[shareId];
    }
  })

  socket.on("user-upload-file", (userId, fs) =>{
    console.log("fs:", fs)
    // pop up message that user upload files
    popUpMessage(userId);
    // adding the files from the dir and make that click on file will download him!
    //displayFiles(ROOM_ID, fs);
  })
});

// display the user that disconnected:
const popUpMessage = (userId) => {
  let dcMessageItself = $(".dc_msg_itself")
  dcMessageTag.css({
    "right": String(mainRightWidth) + "px",
    "display": "block",
    "visibility": "visible",
    "opacity": start_opacity
  })
  dcMessageItself.text(userId + " upload files");
  setTimeout(function (tag) {
    var opacity = start_opacity
    const IntervalId = setInterval((tag) => {
      opacity -= 0.1
      if (opacity > 0) {
        tag.css("opacity", String(opacity))
      } else {
        tag.css("opacity", 0)
        tag.css({"display": "none", "visibility": "hidden"})
        clearInterval(IntervalId)
      }
    }, 200, tag)
  }, 1800, dcMessageTag)
}

// get the download page
const showFiles = () => {
  socket.emit("file-download-clicked")
  window.open("/download/" + ROOM_ID);
}

//Connecting to new user peer.
const connectToNewUser = (userId, stream) => {
  //We are calling new user and sending him our stream
  const call = peer.call(userId, stream);
  peers[userId] = call;
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    //------------------------------------problem cant delete the new user after share-------------//
    video.remove();
  });
};

//Add stream into our own page
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
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
  document.querySelector(".main_mute_button").innerHTML = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
};

// change the icon on click
const setUnmuteButton = () => {
  document.querySelector(".main_mute_button").innerHTML = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
};

// change the icon on click
const setStopVideo = () => {
  document.querySelector(".main_video_button").innerHTML = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
};

// change the icon on click
const setPlayVideo = () => {
  document.querySelector(".main_video_button").innerHTML = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
};

//Close and open chat bar
var chat_off = false;
const chatOnChatOff = () => {
  if (!chat_off) {
    chat_off = true;
    $(".main_left").css("flex", "1");
    $(".main_right").css({"flex": "0", "display": "none"});
  } else {
    chat_off = false;
    $(".main_left").css("flex", "0.8");
    $(".main_right").css({"flex": "0.2", "display": ""});
  }
};

// display the user that disconnected:
let mainRightWidth = $(".main_right").width() + 10;
let dcMessageTag = $(".disconnect_message")
let start_opacity = parseFloat(dcMessageTag.css("opacity")) // Trying to get the initial opacity configured in the .css file.

const dcPopup = (userId) => {
  let dcMessageItself = $(".dc_msg_itself")
  dcMessageTag.css({
    "right": String(mainRightWidth) + "px",
    "display": "block",
    "visibility": "visible",
    "opacity": start_opacity
  })
  dcMessageItself.text(userId + " has disconnected");
  setTimeout(function (tag) {
    var opacity = start_opacity
    const IntervalId = setInterval((tag) => {
      opacity -= 0.1
      if (opacity > 0) {
        tag.css("opacity", String(opacity))
      } else {
        tag.css("opacity", 0)
        tag.css({"display": "none", "visibility": "hidden"})
        clearInterval(IntervalId)
      }
    }, 50, tag)
  }, 1800, dcMessageTag)
}

const leavingMeetingButtonClicked = () => {
  location.href = "leaving_the_room.html"            // redirect and come back to home page!
}

let alreadyShared = false;
let video_element
// share screen:
const shareButtonClicked = () => {
  // get display media
  if (alreadyShared) {
    socket.emit("re-share", ROOM_ID, firstShare[0])
  }
  navigator.mediaDevices.getDisplayMedia({video: true}).then((mediaStream) => {
    firstShare.push(mediaStream.id)
    myShareStream = mediaStream
    var video = document.createElement("video");
    video.srcObject = mediaStream;
    video.onloadedmetadata = (e) => {
      video.play()
    };
    video_element = video
    videoGrid.append(video)
    if (!alreadyShared) {
      socket.emit("share", ROOM_ID, ID_SHARE);
    } else {
      let mediaStreamVideo = mediaStream.getVideoTracks()[0]
      Object.getOwnPropertyNames(peers).forEach(userId => {
        let sender = peers[userId].peerConnection.getSenders().find(function (s) {
          return s.track.kind === mediaStreamVideo.kind;
        })
        sender.replaceTrack(mediaStreamVideo);
      })
    }
    // On call- then answer
    peer2.on("call", (call) => {
      peers[call.peer] = call
      call.answer(mediaStream);
    })
    // When user connected add the share stream to him
    socket.on("user-connected", (userId) => {
      setTimeout((userId, mediaStream) => {
        //We are calling new user and sending him our stream
        peers[userId] = peer2.call(userId, mediaStream);
      }, 1000, userId, mediaStream);
    });
    mediaStream.getVideoTracks()[0].onended = function () {
      socket.emit("end-share", ROOM_ID, firstShare[0])
      //myShareStream.getVideoTracks()[0].enabled = false;
      video.remove();
    };
    alreadyShared = true
  })
}

// upload files
const fileButtonClicked = () => {
  socket.emit("file-upload", ID)
  window.open("/upload/" + ROOM_ID);
}



// // stop share:
// const stopShareButtonClicked = () => {
//   socket.emit("end-share", ROOM_ID, firstShare[0])
//   // myShareStream.getVideoTracks()[0].enabled = false;
//   video_element.remove();
// }
