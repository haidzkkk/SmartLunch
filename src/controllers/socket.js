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

    httpServer.listen(process.env.PORT_SOCKET);
} 

// khi gọi thì client nào lắng nghe "client-listen-message" thì sẽ nhận được được data
exports.sendRoomToClient = (userId, room) =>{
    console.log(`link room socket: client-listen-room-${userId}`);
    io.emit(`client-listen-room-${userId}`, room)
} 

exports.sendMessageToClient = (roomId, message) =>{
    console.log(`link room socket: client-listen-message-${roomId}`);
    io.emit(`client-listen-message-${roomId}`, message)
} 

