const express = require("express");           // using express for our web upp
const app = express();
const upload = require('express-fileupload')
const bodyParser = require('body-parser')
const fs = require('fs');
const {default: axios} = require('axios')

var socket_copy
var user_file
const http = require("http")
const server = http.Server(app);   // server
const { v4: uuidv4 } = require("uuid");       // for unique id
const io = require("socket.io")(server);      // socket for connection

const { ExpressPeerServer } = require("peer"); // peer to peer = send stream from one to another
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");                // embedded js
app.use(express.static("public"));
app.use("/peerjs", peerServer);               // using peer and giving unique id!!!!
app.use(upload())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
  // directory path
  const dir = './uploads';
  // create new directory
  try {
    // first check if directory already exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Directory is created.");
    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/${uuidv4()}`); // redirect url
});

app.get("/:room", (req, res) => {
  // render room.ejs and get room's id
  const dir = './uploads'+ "/uploads" + "-" + req.params.room;
  // create new directory
  try {
    // first check if directory already exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Directory is created.");
    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
  res.render("room", { roomId: req.params.room });
});

app.get('/upload/:room',(req, res) => {
  // directory path
  const dir = './uploads'+ "/uploads" + "-" + req.params.room;
  // create new directory
  try {
    // first check if directory already exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Directory is created.");
    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
  res.render("index", { roomId: req.params.room })
})

app.post('/upload/:room',(req,res) => {
  if (req.files) {
    var file = req.files.file
    var filename = file.name
    console.log(__dirname + '/uploads' + "-" + req.params.room + "/" + filename)
    file.mv(__dirname + '/uploads' + '/uploads' + "-" + req.params.room + "/" + filename, function(err) {
      if (err) {
        res.send(err)
      } else {
        res.send("uploaded successfully!")
        socket_copy.broadcast.to(req.params.room).emit("user-upload-file", user_file, fs);
      }
    })
  }
})

app.get('/download/:room',(req,res) => {
  var path = __dirname + '\\uploads' + "\\uploads-" + req.params.room
  let list_modified_files = []
  let list_files = fs.readdirSync(path)
  list_files.sort(function (a, b){
    if(a > b) return 1;
    if(a < b) return -1;
    return 0;
  })
  list_files.forEach(function(file){
    console.log(file);
    let fullPath = path + '\\' + file
    let stats = fs.statSync(fullPath);
    list_modified_files.push({file_name:file, modifyDate: stats.mtime})
  })
  res.render("download", { roomId: req.params.room , files: list_modified_files})
})

app.get('/download/:room/:fileName',(req,res) => {
  const file = `${__dirname}/uploads/uploads-${req.params.room}/${req.params.fileName}`;
  console.log(file)
  res.download(file); // Set disposition and send it.
})

io.on("connection", (socket) => { // todo change to async>??
  console.log("Connection")
  socket.on("check-courses", async (jwt_raw, jwt_decoded, roomId)=> {
    let list_of_classrooms = []
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt_raw}`
      const user_courses = await axios.get('http://localhost:7001/api/course/user')
      user_courses.data.forEach(course => {
        if (typeof course.classrooms !== 'undefined') {
          list_of_classrooms = list_of_classrooms.concat(course.classrooms)
        }

      })
      console.log(list_of_classrooms)
      if (list_of_classrooms.indexOf(roomId) === -1) {
        io.to(socket.id).emit("redirect", 'http://localhost:5000')
        socket.disconnect()
      }
    } catch (err) {
      io.to(socket.id).emit("redirect", 'http://localhost:5000')
      socket.disconnect()
    }
  })
  socket.on("join-room", (roomId, userId, shareId, userName) => {
    // console.log(io.sockets.adapter.rooms.get(roomId).currentShare)
    console.log("join room")
    socket.join(roomId);
    if (typeof io.sockets.adapter.rooms.get(roomId).disabledShares === 'undefined') {
      io.sockets.adapter.rooms.get(roomId).disabledShares = [] // todo - 24/6 - change to array cause this isnt serializable
    }
    if (typeof io.sockets.adapter.rooms.get(roomId).triples === 'undefined') {
      io.sockets.adapter.rooms.get(roomId).triples = [] // todo - 24/6 - change to array cause this isnt serializable
    }
    io.sockets.adapter.rooms.get(roomId).triples.push([userId, userName, socket.id])
    io.to(socket.id).emit("update-sharer", roomId, io.sockets.adapter.rooms.get(roomId).currentShare,
        io.sockets.adapter.rooms.get(roomId).disabledShares, io.sockets.adapter.rooms.get(roomId).triples); // todo continue this transition on script.js - check if that is the right roomId, cause every client can be on few zooms. and then try to call, get rejected, and get called back by the sharer.
    socket.broadcast.to(roomId).emit("user-connected", userId, userName, socket.id); // emit the event from the server to the rest of the users in specific room
    socket.on("message", (message, name) => {
      let new_date = new Date();
      let time_rn =
          ("0" + new_date.getHours()).slice(-2) +
          ":" +
          ("0" + new_date.getMinutes()).slice(-2) +
          ":" +
          ("0" + new_date.getSeconds()).slice(-2);
      io.to(roomId).emit("createMessage", message, time_rn, name);
    });

    socket.on("share", (roomId, activeShareId) => {
      io.sockets.adapter.rooms.get(roomId).currentShare = activeShareId
      socket.broadcast.to(roomId).emit("user-sharing", activeShareId, socket.id);
    });

    socket.on("mute-video", (socket_id) => {
      io.to(socket_id).emit("mute-your-video")
    })
    socket.on("mute-audio", (socket_id) => {
      io.to(socket_id).emit("mute-your-audio")
    })
    socket.on("private-message", (socket_id, private_msg, sender_name) => {
      let new_date = new Date();
      let time_rn =
          ("0" + new_date.getHours()).slice(-2) +
          ":" +
          ("0" + new_date.getMinutes()).slice(-2) +
          ":" +
          ("0" + new_date.getSeconds()).slice(-2);
      io.to(socket_id).emit("private-message", private_msg, sender_name, time_rn)
    })

    socket.on("re-share", (roomId, activeShareId) => {
      io.sockets.adapter.rooms.get(roomId).currentShare = activeShareId
      io.sockets.adapter.rooms.get(roomId).disabledShares = io.sockets.adapter.rooms.get(roomId).disabledShares.filter(e => e !== activeShareId)
      socket.broadcast.to(roomId).emit("user-re-sharing", activeShareId);
    });

    socket.on("end-share", (roomId, activeShareId) => {
      io.sockets.adapter.rooms.get(roomId).disabledShares.push(activeShareId)
      console.log(io.sockets.adapter.rooms.get(roomId).disabledShares)
      io.sockets.adapter.rooms.get(roomId).currentShare = null
      socket.broadcast.to(roomId).emit("ending-share", activeShareId)
    })


    socket.on("disconnect", () => { // Will it disconnect from every room he is involved?? how will it know which room
      socket.broadcast.to(roomId).emit("share-disconnected", shareId)
      socket.broadcast.to(roomId).emit("user-disconnected", userId, userName);
    });

    socket.on("file-upload", (ui)=>{
      socket_copy = socket
      user_file = ui
    })

    socket.on("drowsiness-check",(roomId, OriginID, counter) => {
      io.to(roomId).emit("upload-frame", socket.id, counter);
      console.log("drowsiness-check")
    })

    socket.on("call-to-me", (callThisUserId, shareSocketId) => {
      io.to(shareSocketId).emit("call-this", roomId, callThisUserId);
    })

    socket.on("data-url", async (roomId, userId, dataUrl, socketId_drowsiness, counter) => {
      console.log("in data url in server")
      try {
        let resp = await axios.post('http://localhost:6000', {imgBase64: dataUrl, userId: userId})
        io.to(socketId_drowsiness).emit("awake-percentage", resp.data.userId, resp.data.awake, counter)
      } catch (err) {
        console.error(err)
      }
    })

    socket.on("post-survey", async (roomId, userId, jsonSurvey, name) => {
      console.log("in post-survey in server")
      try {
        let resp = await axios.post('http://localhost:4001/api/polls/',
            {question: jsonSurvey.question, options: jsonSurvey.options})
        let new_date = new Date();
        let time_rn =
            ("0" + new_date.getHours()).slice(-2) +
            ":" +
            ("0" + new_date.getMinutes()).slice(-2) +
            ":" +
            ("0" + new_date.getSeconds()).slice(-2);
        io.to(roomId).emit("post-chat-survey", name, 'http://localhost:4000/poll/' + String(resp.data._id), jsonSurvey.question, time_rn);
      } catch (err) {
        console.error(err)
      }

    })


  });
});

// listen on some port
server.listen(3030, ()=>{
  console.log("listen on port 3030")
});
