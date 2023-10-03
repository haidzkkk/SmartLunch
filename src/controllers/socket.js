var express = require('express');
const createServer = require("http").createServer;
const Server = require("socket.io").Server;

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

exports.initializeSocketServer = ()=>{


    io.on("connection", async (socket) => {
        console.log("Socket.io client connected")
        
        // socket.on("server-listen-room", (json) =>{
        //     this.sendMessageToClient("admin: " + json)
        // })
    })

    httpServer.listen(3001);
} 

// khi gọi thì client nào lắng nghe "client-listen-message" thì sẽ nhận được được data
exports.sendMessageToClient = (message) =>{
    io.emit("client-listen-message", message)
} 
