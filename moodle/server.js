const express = require("express");           // using express for our web upp
const app = express();
const http = require("http");
const server = http.Server(app);   // server'

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

app.get("/", (req, res) => {
    res.render('moodle');
})


// app.get("/:room", (req, res) => {
//     // render room.ejs and get room's id
//     const dir = './uploads'+ "/uploads" + "-" + req.params.room;
//     // create new directory
//     try {
//         // first check if directory already exists
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//             console.log("Directory is created.");
//         } else {
//             console.log("Directory already exists.");
//         }
//     } catch (err) {
//         console.log(err);
//     }
//     res.render("room", { roomId: req.params.room });
// });


// listen on some port
server.listen(7000, ()=>{
    console.log("listen on port 7000")
});