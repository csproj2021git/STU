const express = require("express");           // using express for our web upp
const app = express();
const upload = require('express-fileupload')
const fs = require('fs');
var socket_copy
var user_file

const server = require("http").Server(app);   // server
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


io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, shareId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId); // emit the event from the server to the rest of the users in specific room
    socket.on("message", (message) => {
      let new_date = new Date();
      var time_rn =
          ("0" + new_date.getHours()).slice(-2) +
          ":" +
          ("0" + new_date.getMinutes()).slice(-2) +
          ":" +
          ("0" + new_date.getSeconds()).slice(-2);
      io.to(roomId).emit("createMessage", message, time_rn);
    });

    socket.on("share", (roomId, userId) => {
      socket.broadcast.to(roomId).emit("user-sharing", userId);
    });

    socket.on("re-share", (roomId, mediaStreamId) => {
      socket.broadcast.to(roomId).emit("user-re-sharing", mediaStreamId);
    });

    socket.on("end-share", (roomId, mediaStreamId) => {
      socket.broadcast.to(roomId).emit("ending-share", mediaStreamId)
    })
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("share-disconnected", shareId)
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("file-upload", (ui)=>{
      socket_copy = socket
      user_file = ui
    })
  });
});

// listen on some port
server.listen(3030, ()=>{
  console.log("listen on port 3030")
});
