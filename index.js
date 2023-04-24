const express = require("express");
const app =express();
var server = require("http").Server(app)
const {Server} = require("socket.io")
// var io = require("socket.io")(server)
var io = new Server(server)
var path = require('path')
// console.log(server)
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname+"/public/canvas.html"))
})

app.get('/controller', (req, res)=> {
    res.sendFile(path.join(__dirname+'/public/controller.html'));
})


let controllers = {}

setInterval(()=>io.emit("update", Object.values(controllers)), 30)



server.listen(3000,()=>{console.log("Server listening at port 3000")})
// console.log("hello")
io.sockets.on("connection", (client)=>{
    console.log("client connected")
    //client.emit("connect")
    client.on("controller", ()=>{
        client.on("update", (dist)=>{
            controllers[client.id]=dist;
        });
        client.on("disconnect", ()=> {
            delete controllers[client.id];
        })
    })
})

