const videoGrid = document.getElementById("videos_grid");
const myVideo = document.createElement("video");
const canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
const ctx = canvas.getContext("2d") // The use of canvas is because more browsers supports it.
const peers = {};
const peers2 = {}; // Added again after realizing we overwritten peers with share calls. its only for someone who watches my share.
myVideo.muted = true;
var myVideoStream;
var myShareStream
let ID
let ID_SHARE
let NAME
// let firstShare = [] // todo I do not remember what is that for, but do me and favor and stop screen share of others if you start one as well.
let currentShare = null
let fullscreenId = null
let globalDisabledShares = null
let survey = document.getElementById('survey-form')
let survey_button = document.getElementById('survey-form-submit-button')
// let enlargedVideo


window.onload = function() {

  // A function to handle sending messages.
  function sendMessage(e) {
      // Prevent any default browser behaviour.
      e.preventDefault();

      // Send a message with the text 'Hello Treehouse!' to the new window.
      receiver.postMessage('cookie data!', 'http://wrong-domain.com');
  }

  // Add an event listener that will execute the sendMessage() function
  // when the send button is clicked.
  btn.addEventListener('click', sendMessage);
}


const socket = io("/");

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
let ID_PROMISE = new Promise((resolve, reject) => {
  peer.on("open", (id_peer) => {
    resolve(id_peer)
  });
}).then(setId => ID = setId)


let ID_SHARE_PROMISE = new Promise((resolve, reject) => {
  peer2.on("open", (id_peer2) => {
    resolve(id_peer2)
  })
}).then(setShareId => ID_SHARE = setShareId)

let NAME_PROMISE = new Promise((resolve, reject) => {
  let enterName = document.getElementById("enter-name")
  let enterNameButton = document.getElementById("name-button")
  let nameInput = document.getElementById("name-input")

  setTimeout(()=>{enterName.classList.add("open-enter-name")}, 2500)

  enterNameButton.addEventListener("click", () => {
    console.log('event click name change')
    if (nameInput.value) {
      resolve(nameInput.value)
      $("html").unbind('keydown')
      enterName.classList.remove("open-enter-name")
    }
  }) // , {once: true})
  $("html").bind('keydown', (e) => {
    if (e.which === 13 && nameInput.value.length !== 0) { // If enter was pressed before entering name
      resolve(nameInput.value)
      $("html").unbind('keydown') // todo fix so messages will work again
      enterName.classList.remove("open-enter-name")
    }
  });
}).then(setName => NAME = setName)

Promise.all([ID_PROMISE, ID_SHARE_PROMISE, NAME_PROMISE]).then((values) => {
  if (typeof ID === 'undefined') {
    ID = values[0]
  }
  if (typeof ID_SHARE === 'undefined') {
    ID_SHARE = values[1]
  }
  if (typeof NAME === 'undefined') {
    NAME = values[2]
  }
  socket.emit("join-room", ROOM_ID, ID, ID_SHARE, NAME);
  // Putting messaging here, because we already chose the name, so enter key is for sending messages now.
  // input value
  let text = $("input");
  // when press enter send message
  $("html").keydown((e) => {
    if (e.which === 13 && text.val().length !== 0) {
      socket.emit("message", text.val(), NAME);
      text.val("");
    }
  });
})


navigator.mediaDevices.getUserMedia({
  // access to the devices
  // video: true,
  video: {
    width: {max: 320},
    height: {max: 240},
    frameRate: {max: 30}
  },
  audio: true,
}).then((stream) => {
  peer.on("call", (call) => {
    console.log("call", call.peer)
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      console.log("Streaming boyssss", call.peer)
      if (!peers[call.peer]) {
        peers[call.peer] = call // was outside below stream
        addVideoStream(video, userVideoStream, call.peer);
      }
    });
    if (currentShare !== call.peer) {
      call.answer(stream); // todo add sdp
    } else {
      call.answer(null)
    }

  });
  console.log("Got user media")
  myVideoStream = stream;
  addVideoStream(myVideo, stream, ID); // add my video stream

  socket.on("createMessage", (message, time_rn, name) => {
    $("ul").append(`
        <li class="message">
          <b>${name}</b>
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

  socket.on("update-sharer", (roomId, currentSharer, disabledShares) => {
    console.log(roomId, currentSharer, disabledShares[0])
    if (ROOM_ID === roomId) {
      globalDisabledShares = [...disabledShares];
      if (currentSharer) { // If it actually has something, and is not 'undefined'.
        currentShare = currentSharer // todo we now know who to call, get rejected, and get called back.
      }
    }
    console.log(currentShare)
    console.log('disabled', globalDisabledShares)
  })

  socket.on("user-sharing", (shareId, socketId) => {
    console.log("user sharing", shareId)
    currentShare = shareId
    // Exp
    socket.emit("call-to-me", ID, socketId)
    // Exp
    // todo add everybody muted and video cut off, and muted and video boolean
    // trying to do it now
    let _voice = myVideoStream.getAudioTracks()[0].enabled
    let _video = myVideoStream.getVideoTracks()[0].enabled
    // setTimeout(connectToNewUser, 1000, shareId, stream); // to success to answer
    if (_voice) {
      muteUnmute()
    }
    if (_video) {
      playStop()
    }
  })

  socket.on("ending-share", (shareId) => {
    globalDisabledShares.push(shareId)
    currentShare = null
    let v = document.getElementById(shareId);
    console.log("ending-share: ", shareId, v)
    if (v) {
      invisibleVideo(v)
    }
  })

  socket.on("user-re-sharing", (shareId) => { // todo simplify?
    globalDisabledShares = globalDisabledShares.filter(e => e !== shareId)
    currentShare = shareId
    let v = document.getElementById(shareId);
    console.log("reshare", shareId, v)
    if (v) {
        defaultVideoSize(v)
    }
  })
  // LAST change
  //When new user connects, we connect to him
  socket.on("user-connected", (userId) => {
    console.log('User Connected')
    setTimeout(connectToNewUser, 1000, userId, stream); // to success to answer
  });

  // When user disconnects, we disconnect from him
  socket.on("user-disconnected", (userId, userName) => {
    console.log("user dc")
    if (peers[userId]) {
      console.log("user dc2")
      peers[userId].close();
      delete peers[userId];
      dcPopup(userName)
      document.getElementById(userId).remove() // Experimental
    }
  });

  socket.on("share-disconnected", (shareId) => {
    console.log("share dc")
    if (currentShare === shareId) {
      currentShare = null
    } else {
      globalDisabledShares = globalDisabledShares.filter(e => e !== shareId)
    }
    if (peers[shareId]) {
      peers[shareId].close();
      delete peers[shareId];
      document.getElementById(shareId).remove() // Experimental
    }
  })

  socket.on("user-upload-file", (userId, fs) =>{
    console.log("fs:", fs)
    // pop up message that user upload files
    popUpMessage(userId);
    // adding the files from the dir and make that click on file will download him!
    //displayFiles(ROOM_ID, fs);
  })

  socket.on("upload-frame", () => {
    console.log("got the upload query")
    // ctx.filter = "brightness(150%)"
    ctx.drawImage(myVideo, 0, 0, 640, 480)
    let dataUrl = canvas.toDataURL("image/png")
    socket.emit("data-url", ROOM_ID, ID, dataUrl)
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
  console.log("connect to user", userId)
  const call = peer.call(userId, stream); // todo add sdp

  const video = document.createElement("video");
  // video.setAttribute("id", userId) // Experimental
  call.on("stream", (userVideoStream) => {
    console.log("Streaming boyssss", userId)
    if (!peers[userId]) {
      peers[userId] = call; // was below const call
      addVideoStream(video, userVideoStream, userId);
    }
  });

  // call.on("close", () => { // Experimental
  //   //------------------------------------problem cant delete the new user after share-------------//
  //   console.log("I need ot be removed")
  //   video.remove();
  // });
};

//Connecting to user, with stream
const oneSidedCall = (userId, stream) => {
  //We are calling new user and sending him our stream
  console.log("connect to user with share", userId)
  const call = peer2.call(userId, stream); // todo add sdp
  peers2[userId] = call;
};

//Add stream into our own page
const addVideoStream = (video, stream, videoId) => {
  console.log("adding video", videoId)
  video.id = videoId
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  video.addEventListener('dblclick', ()=> {
    if (!fullscreenId) {
      console.log("fullscreen", video.id)
      fullscreenId = video.id
      fakeFullscreen(video)
    }
    else if (fullscreenId === video.id) {
      console.log("disable fullscreen", video.id)
      fullscreenId = null
      defaultVideoSize(video)
    }
    else {
      console.log("disabling", fullscreenId, "activating", video.id)
      defaultVideoSize(document.getElementById(fullscreenId))
      fullscreenId = video.id
      fakeFullscreen(video)
    }
    // THAT WAS FOR FULL SCREEN
    // if (!document.fullscreenElement) {
    //   video.requestFullscreen().catch(err => {
    //     // alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    //     video.webkitRequestFullscreen().catch(err => {
    //       alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    //     })
    //   });
    // } else {
    //   document.exitFullscreen();
    // }
    // THAT WAS FOR FULL SCREEN
  })
  video.addEventListener('pause', e => {
    video.play()
  })
  // todo change the resize.. double click for full screen
  // removed resize
  // if (video.getAttribute('listener') !== 'true') {
  //
  //   video.addEventListener("click", (e) => {
  //     if (video.getAttribute('enlarged') === 'false') {
  //       video.style.transform = 'scale(2)'
  //       video.setAttribute('enlarged', 'true')
  //       if (enlargedVideo !== undefined) {
  //         enlargedVideo.click()
  //       }
  //       enlargedVideo = video
  //     } else {
  //       video.style.transform = 'scale(1)'
  //       video.setAttribute('enlarged', 'false')
  //       if (enlargedVideo !== video) {
  //         enlargedVideo.click()
  //       }
  //       enlargedVideo = undefined
  //     }
  //   })
  //   video.setAttribute('enlarged', 'false')
  //   video.setAttribute('listener', 'true')
  // }
  //
  if (Array.isArray(globalDisabledShares) && globalDisabledShares.includes(videoId)) {
    invisibleVideo(video)
  }
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
      <i></i>
      <span>Mute</span>
    `;
};

// change the icon on click
const setUnmuteButton = () => {
  document.querySelector(".main_mute_button").innerHTML = `
      <i></i>
      <span>Unmute</span>
    `;
};

// change the icon on click
const setStopVideo = () => {
  document.querySelector(".main_video_button").innerHTML = `
      <i></i>
      <span>Stop Video</span>
    `;
};

// change the icon on click
const setPlayVideo = () => {
  document.querySelector(".main_video_button").innerHTML = `
    <i></i>
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
  if (currentShare) {
    alert('A peer is already streaming.')
  } else {

    // get display media
    if (alreadyShared) {
      socket.emit("re-share", ROOM_ID, ID_SHARE)
    }
    navigator.mediaDevices.getDisplayMedia({video: true}).then((mediaStream) => {
      // firstShare.push(mediaStream.id)

      myShareStream = mediaStream
      var video = document.createElement("video");
      // last EXP
      // video.srcObject = mediaStream; // HELPPP
      // video.onloadedmetadata = (e) => {
      //   video.play()
      // };
      // video_element = video
      // video.id = ID_SHARE
      // videoGrid.append(video)
      // last EXP
      addVideoStream(video, mediaStream, ID_SHARE)
      if (!alreadyShared) {
        socket.emit("share", ROOM_ID, ID_SHARE);
      } else {
        let mediaStreamVideo = mediaStream.getVideoTracks()[0]
        Object.getOwnPropertyNames(peers).forEach(userId => {
          let sender = peers2[userId].peerConnection.getSenders().find(function (s) {
            return s.track.kind === mediaStreamVideo.kind;
          })
          sender.replaceTrack(mediaStreamVideo);
        })
      }
      // On call- then answer
      //Exp
      // peer2.on("call", (call) => {
      //   // todo reject call here and call back.
      //   peers[call.peer] = call
      //   call.answer(mediaStream); // todo add sdp
      // })
      //Exp
      // When user connected add the share stream to him
      socket.on("user-connected", (userId) => {
        setTimeout((userId, mediaStream) => {
          //We are calling new user and sending him our stream
          peers2[userId] = peer2.call(userId, mediaStream); // todo add sdp
        }, 1000, userId, mediaStream);
      });
      socket.on("call-this", (CheckRoomId, callThisId) => {
        console.log("request to call to", callThisId)
        if (CheckRoomId === ROOM_ID) {
          peers2[callThisId] = peer2.call(callThisId, mediaStream)
        }
      })
      mediaStream.getVideoTracks()[0].onended = function () {
        // socket.emit("end-share", ROOM_ID, firstShare[0])
        // New one
        socket.emit("end-share", ROOM_ID, ID_SHARE)
        currentShare = null
        //myShareStream.getVideoTracks()[0].enabled = false;
        video.remove();
      };
      alreadyShared = true
      currentShare = ID_SHARE
    })
  }
}

const surveyButtonClicked = () => {
  // window.open("localhost:4000");
  if (!survey.classList.contains('open-survey-form')) {
    survey.classList.add('open-survey-form')
    survey_button.addEventListener("click", disappear_form) // todo check if its not adding each time another callback
  }
}
const disappear_form = () => {
  survey.classList.remove('open-survey-form')
}
// upload files
const fileButtonClicked = () => {
  socket.emit("file-upload", ID)
  window.open("/upload/" + ROOM_ID);
}

const drowsinessButtonClicked = () => {
  socket.emit("drowsiness-check", ROOM_ID, ID)
  // START CALCULATE % OF STUDENTS AWAKE OR NOT, CHANGING AND SENDING MESSAGE TO TEACHER ABOUT %'S


  // ctx.drawImage(myVideo, 0, 0, 640, 480)
  // let jpegFile = canvas.toDataURL("image/png")
  // console.log("after to data url")
  // $.ajax({
  //   type: 'POST',
  //   url: 'http://localhost:3030/test/' + ROOM_ID + '/' + ID + '/',
  //   data: {
  //     imgBase64: jpegFile,
  //     userId: ID
  //   },
  //   // processData: false,
  //   // contentType: false,
  //   success: function(msg){
  //     console.log('posted' + msg);
  //   }
  // });
  // console.log("after ajax")
  // // console.log(jpegFile)
}

function defaultVideoSize(elem) {
  elem.style.objectFit = 'fill'
  elem.style.width = '320px'
  elem.style.height = '240px'
  elem.style.visibility = "visible"
}

function fakeFullscreen(elem) {
  elem.style.objectFit = 'cover'
  elem.style.width = '100vw'
  elem.style.height = '100vh'
  if (!chat_off) {
    chatOnChatOff()
  }
}

function invisibleVideo(elem) {
      elem.style.visibility = "hidden"
      elem.style.height = "0"
      elem.style.width = "0"
}
