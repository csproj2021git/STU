const express = require("express"); // using express for our web upp
const app = express();

const server = require("http").Server(app); // server
const { v4: uuidv4 } = require("uuid"); // for uniqe id
const io = require("socket.io")(server); // socket for connection

const { ExpressPeerServer } = require("peer"); // peer to peer = send stream from one to another
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs"); // embeded js
app.use(express.static("public"));
app.use("/peerjs", peerServer); // using peer

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`); // redirect url
});

app.get("/:room", (req, res) => {
  // render room.ejs and get room's id
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId); // emit the event from the server to the rest of the users in specific room
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
    // socket.on("disconnect", () => {
    //   io.to(roomId).broadcast.emit("user-disconnected", userId);
    // });
  });
});
server.listen(7678); // listen on some port
