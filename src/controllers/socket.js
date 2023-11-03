var { log } = require('console');
var express = require('express');
var createServer = require("http").createServer;
var Server = require("socket.io").Server;
var authController = require('../controllers/auth');
const { el } = require('date-fns/locale');

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

var START_CALL = "start_call"
var CREATE_OFFER = "create_offer"
var CREATE_ANSWER = "create_answer"
var CREATE_STOP = "create_stop"
var ICE_CANDIDATE = "ice_candidate"

var CALL_RESPONSE= "call_response"
var OFFER_RECEIVED = "offer_received"
var ANSWER_RECEIVED = "answer_received"
var STOP_RECEIVED = "stop_received"

var OK = "ok"
var NO = "no"


exports.initializeSocketServer = ()=>{

    io.on("connection", async (socket) => {
        console.log("Socket.io client connected")
        

        socket.on("server-listen-call", (json) =>{
            handleAsSignalingServer(json)
        })
    })

    httpServer.listen(process.env.PORT_SOCKET);
} 

exports.sendRoomToClient = (userId, room) =>{
    console.log(`link room socket: client-listen-room-${userId}`);
    if(userId != room.userUserId._id){
        const temp = room.shopUserId;
        room.shopUserId = room.userUserId;
        room.userUserId = temp;
    }
    io.emit(`client-listen-room-${userId}`, room)
} 

exports.sendMessageToClient = (roomId, message) =>{
    console.log(`link room socket: client-listen-message-${roomId}`);
    io.emit(`client-listen-message-${roomId}`, message)
} 

handleAsSignalingServer = (json) => {
    const reqCall = JSON.parse(json)
    
    switch(reqCall.type){
        case START_CALL: {
            if(reqCall.targetUser._id != null){
                var userToCall = authController.getOneById(reqCall.targetUser._id)
                if(userToCall != null){
                    io.emit(`client-listen-call-${reqCall.myUser._id}`,
                    JSON.stringify(
                        {
                            type: CALL_RESPONSE,
                            targetUser: userToCall,
                            data: OK
                        }
                    ))
                    console.log(`CALL_RESPONSE ok: về ${reqCall.myUser.first_name}`)
                }else{
                    io.emit(`client-listen-call-${reqCall.myUser._id}`,
                    JSON.stringify({
                        type: CALL_RESPONSE,
                        data: NO
                    }))
                    console.log(`CALL_RESPONSE no: client-listen-call-${reqCall.myUser._id}`)
                }
          }
          break
        }
        case CREATE_OFFER: {
            if(reqCall.targetUser._id != null){
                var userToReceiveOffer = authController.getOneById(reqCall.targetUser._id)
                if(userToReceiveOffer != null){
                    io.emit(`client-listen-call-${reqCall.targetUser._id}`,
                    JSON.stringify({
                        type: OFFER_RECEIVED,
                        myUser: reqCall.myUser,
                        data: reqCall.data.sdp
                    }))
                    console.log(`OFFER_RECEIVED: đến ${reqCall.targetUser.first_name}`)
                }
            }
            break
        }
        case CREATE_ANSWER: {
            if(reqCall.targetUser._id != null){
                var userToReceiveAnswer = authController.getOneById(reqCall.targetUser._id)
                console.log(`ANSWER_RECEIVED: Đến ${reqCall.targetUser.first_name}`)
                if(userToReceiveAnswer != null){
                    io.emit(`client-listen-call-${reqCall.targetUser._id}`,
                    JSON.stringify({
                        type: ANSWER_RECEIVED,
                        myUser: reqCall.myUser,
                        data: reqCall.data == NO ? NO : reqCall.data.sdp
                    }))
                }
            }
            break
        }
        case CREATE_STOP: {
            if(reqCall.targetUser._id != null){
                var userToReceiveAnswer = authController.getOneById(reqCall.targetUser._id)
                if(userToReceiveAnswer != null){
                    console.log(`CREATE_STOP: Đến ${reqCall.targetUser.first_name}`)
                    io.emit(`client-listen-call-${reqCall.targetUser._id}`,
                    JSON.stringify({
                        type: STOP_RECEIVED,
                        myUser: reqCall.myUser,
                    }))
                    console.log(`CREATE_STOP: Đến ${reqCall.myUser.first_name}`)
                    io.emit(`client-listen-call-${reqCall.myUser._id}`,
                    JSON.stringify({
                        type: STOP_RECEIVED,
                        myUser: reqCall.myUser,
                    }))
                }
            }
            break
        }
        case ICE_CANDIDATE: {
            if(reqCall.targetUser._id != null){
                var userToReceiveIceCandidate = authController.getOneById(reqCall.targetUser._id)
                if (userToReceiveIceCandidate != null) {
                    console.log(`ICE_CANDIDATE: Đến ${reqCall.targetUser.first_name}`)

                    var data = {
                        sdpMLineIndex: reqCall.data.sdpMLineIndex,
                        sdpMid: reqCall.data.sdpMid,
                        sdpCandidate: reqCall.data.sdpCandidate,
                    }

                    io.emit(`client-listen-call-${reqCall.targetUser._id}`,
                    JSON.stringify({
                        type: ICE_CANDIDATE,
                        myUser: reqCall.myUser,
                        data: JSON.stringify(data)
                    }))
                }
            }
            break
        }
    }
}

