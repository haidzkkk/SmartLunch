var { log } = require('console');
var express = require('express');
var createServer = require("http").createServer;
var Server = require("socket.io").Server;
var authController = require('../controllers/auth');
var notificationController = require('../controllers/notification')
var messageController = require('../controllers/message')
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
            if(reqCall.targetUserId != null){
                var userToCall = authController.getOneById(reqCall.targetUserId)
                if(userToCall != null){
                    io.emit(`client-listen-call-${reqCall.myUserId}`,
                    JSON.stringify(
                        {
                            type: CALL_RESPONSE,
                            targetUser: userToCall,
                            data: OK
                        }
                    ))
                }else{
                    io.emit(`client-listen-call-${reqCall.myUserId}`,
                    JSON.stringify({
                        type: CALL_RESPONSE,
                        data: NO
                    }))
                }
          }
          break
        }
        case CREATE_OFFER: {
            console.log(`OFFER_RECEIVED: đến ${reqCall}`)
            if(reqCall.targetUserId != null){
                var userToReceiveOffer = authController.getOneById(reqCall.targetUserId)
                if(userToReceiveOffer != null){
                    var idMessage = reqCall.myUserId
                    messageController.addSdpMessageCall(idMessage, String(reqCall.data.sdp))
                }
            }
            break
        }
        case CREATE_ANSWER: {
            if(reqCall.targetUserId != null){
                var userToReceiveAnswer = authController.getOneById(reqCall.targetUserId)
                if(userToReceiveAnswer != null){
                    if( reqCall.data == NO){
                        messageController.stopCall(reqCall.myUserId)
                        io.emit(`client-listen-call-${reqCall.targetUserId}`,
                        JSON.stringify({
                            type: ANSWER_RECEIVED,
                            data: NO
                        }))
                    }else{
                        messageController.addSdpMessageCall(reqCall.myUserId, String(reqCall.data.sdp))
                        io.emit(`client-listen-call-${reqCall.targetUserId}`,
                        JSON.stringify({
                            type: ANSWER_RECEIVED,
                            data: reqCall.data.sdp
                        }))
                    }
                }
            }
            break
        }
        case ICE_CANDIDATE: {
            console.log(`ICE_CANDIDATE: Đến ${reqCall}`)
            if(reqCall.targetUserId != null){
                var userToReceiveIceCandidate = authController.getOneById(reqCall.targetUserId)
                if (userToReceiveIceCandidate != null) {

                    var data = JSON.stringify({
                        sdpMLineIndex: reqCall.data.sdpMLineIndex,
                        sdpMid: reqCall.data.sdpMid,
                        sdpCandidate: reqCall.data.sdpCandidate,
                    })

                    var idMessage = reqCall.myUserId
                    messageController.addIceCandidateMessageCall(idMessage, data)

                    io.emit(`client-listen-call-${reqCall.targetUserId}`,
                    JSON.stringify({
                        type: ICE_CANDIDATE,
                        // myUser: reqCall.myUserId,
                        data: data
                    }))
                }
            }
            break
        }
        case CREATE_STOP: {
            if(reqCall.targetUserId != null){
                var userToReceiveAnswer = authController.getOneById(reqCall.targetUserId)
                if(userToReceiveAnswer != null){
                    var idMessage = reqCall.myUserId
                    messageController.stopCall(idMessage)
                    io.emit(`client-listen-call-${reqCall.targetUserId}`,
                    JSON.stringify({
                        type: STOP_RECEIVED,
                        myUser: reqCall.myUserId,
                    }))
                }
            }
            break
        }
    }
}

