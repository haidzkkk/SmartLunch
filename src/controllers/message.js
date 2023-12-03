var Message = require('../models/message')
var Room = require('../models/room')
var configApp = require('../config/configApp');
var { uploadImage } = require('../controllers/upload');
const { updateRoomSocket } = require('./room');
var { sendMessageToClient, sendRoomToClient } = require('../controllers/socket');
var notificationController = require('../controllers/notification')

var TYPE_CALLING = 11
var TYPE_CALLED = 12

exports.getMessage = async(req, res, next) =>{
    try{
        const data = await Message.find()        
                            .populate('roomId')
                            .populate('userIdSend')
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.getMessageById = async(req, res, next) =>{
    try{
        var id = req.params.id
        const data = await Message.find({roomId: id})
        .populate('roomId.shopUserId')
        .populate('roomId.userUserId')
        .populate('roomId.userIdSend')
                            .populate('userIdSend')
        if(data != null){
            res.status(200).json(data)
        }else{
            res.status(404).json("not found")
        }
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.getLastMessageCall = async(req, res, next) =>{
    try{
        var id = req.params.id
         // Tìm message có type là 11 và có thời gian gần nhất
         const latestMessage  = await Message.findOne({ roomId: id, type: 11 }).sort({ time: -1 }).exec()

        if(!latestMessage){
            return res.status(404).json("not found")
        }

        const data = await Message.findById(latestMessage._id)
        .populate('roomId.shopUserId')
        .populate('roomId.userUserId')
        .populate('roomId.userIdSend')
        .populate('userIdSend')

        if(data != null){
            res.status(200).json(data)
        }else{
            res.status(404).json("not found")
        }
    }catch(err){
        console.log(err);
        res.status(400).json(err)   
    }
}

exports.postMessage = async(req, res, next) =>{
    try{
        var files = req.files 
        var message = req.body

        var existsRoom = await Room.findById(message.roomId)
        if(!existsRoom){
            return res.status(404).json({message: "Không tìm thấy phòng"})   
        }

        var images = await uploadImage(files)

        message.images = images
        message.userIdSend = req.user.id

        var messageAdd = await Message.create(message)
        var messageAddPopulate = await messageAdd.populate('userIdSend')

        var roomUpdate = await updateRoomSocket(messageAdd.roomId, messageAdd.type, 
            {userIdSend: messageAdd.userIdSend, messSent: messageAdd.message, timeSent: messageAdd.createdAt})

        // giử data socket cho cả 2
        sendMessageToClient(messageAdd.roomId, messageAdd)
        if(roomUpdate != null){
            sendRoomToClient(roomUpdate.userUserId._id, roomUpdate)
            var tempUser = roomUpdate.userUserId
            roomUpdate.userUserId = roomUpdate.shopUserId
            roomUpdate.shopUserId = tempUser
            sendRoomToClient(roomUpdate.userUserId._id, roomUpdate)

        // giử thông báo
            if(messageAdd.userIdSend._id.toString() != roomUpdate.shopUserId._id.toString()){
                notificationController.sendNotifiChat(
                    roomUpdate.shopUserId._id, 
                    roomUpdate.userUserId.first_name + " đã giử tin nhắn cho bạn",
                    messageAdd.message, 
                    roomUpdate.userUserId._id
                    )
            }else{
                notificationController.sendNotifiChat(
                    roomUpdate.userUserId._id, 
                    roomUpdate.shopUserId.first_name + " đã giử tin nhắn cho bạn",
                    messageAdd.message, 
                    roomUpdate.shopUserId._id
                    )
            }
        }
    
        res.status(200).json(messageAddPopulate)  
    }catch(err){
        console.log(err );
        res.status(400).json(err)   
    }
}

exports.postMessageCall = async(req, res, next) =>{
    try{
    var message = req.body

    var existsRoom = await Room.findById(message.roomId)
    if(!existsRoom){
        return res.status(404).json({message: "Không tìm thấy phòng"})   
    }

    message.userIdSend = req.user.id
    var messageAdd = await Message.create(message)
    await messageAdd.populate('userIdSend')
    this.updateRoomAndSendMessageRoomToSocket(messageAdd)

     res.status(200).json(messageAdd)  
        
    }catch(err){
        console.log(err );
        res.status(400).json(err)   
    }
}

exports.updateMessage = async(req, res, next) =>{
    try{
        var id = req.params.id
        var message = req.body
        var messageUpdate = await Message.findByIdAndUpdate(id, message, { new: true })
        res.status(200).json(messageUpdate)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.deleteMessage = async(req, res, next) =>{
    try{
        var id = req.params.id
        var messageDelete = await Message.findByIdAndRemove(id, { new: true })
        res.status(200).json(messageDelete)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateRoomAndSendMessageRoomToSocket = async(messageAdd) =>{
    var roomUpdate = await updateRoomSocket(messageAdd.roomId, messageAdd.type, 
        {userIdSend: messageAdd.userIdSend, messSent: messageAdd.message, timeSent: messageAdd.time})

    // giử data socket cho cả 2
    sendMessageToClient(messageAdd.roomId, messageAdd)
    if(roomUpdate != null){
       sendRoomToClient(roomUpdate)
        

    // giử thông báo
       console.log("alo: " + messageAdd.userIdSend);
        if(messageAdd.userIdSend._id.toString() != roomUpdate.shopUserId._id.toString()){
           notificationController.sendNotifiCall(
               roomUpdate.shopUserId._id, 
               "Bạn có một cuộc gọi",
               roomUpdate.userUserId.first_name + " muốn gọi cho bạn", 
               roomUpdate.userUserId._id
           )
        }else{
           notificationController.sendNotifiCall(
               roomUpdate.userUserId._id, 
               "Bạn có một cuộc gọi",
               roomUpdate.shopUserId.first_name + " muốn gọi cho bạn", 
               roomUpdate.shopUserId._id
           )
        }
   }
}

exports.addSdpMessageCall = async(idMessage, sdp) =>{
    console.log("sdp " + idMessage);
    var message = await Message.findById(idMessage)
    if(sdp && message){
        message.sdp.push(sdp);
        message.save()
    }
}

exports.addIceCandidateMessageCall = async(idMessage, iceCandidate) =>{
    console.log("idMessage " + idMessage);
    var message = await Message.findById(idMessage)
    if(iceCandidate && message){
    message.iceCandidate.push(iceCandidate);
    message.save()
    }
}

exports.stopCall = async(idMessage) =>{

    var messageFind = await Message.findById(idMessage).populate('userIdSend')

    if(messageFind){

        messageFind.type = TYPE_CALLED
        messageFind.sdp = []
        messageFind.iceCandidate = []
        await messageFind.save()

        await Message.updateMany(
            { roomId: messageFind.roomId ,type: TYPE_CALLING },
            { $set: { type: TYPE_CALLED, sdp: [], iceCandidate: [] } }
        );
    
        // thông báo cuộc gọi kết thúc
        var roomUpdate = await updateRoomSocket(messageFind.roomId, messageFind.type, 
            {userIdSend: messageFind.userIdSend, messSent: messageFind.message, timeSent: messageFind.time})
        sendMessageToClient(messageFind.roomId, messageFind)
        if(roomUpdate != null){
        sendRoomToClient(roomUpdate.userUserId._id, roomUpdate)
        var tempUser = roomUpdate.userUserId
        roomUpdate.userUserId = roomUpdate.shopUserId
        roomUpdate.shopUserId = tempUser
        sendRoomToClient(roomUpdate.userUserId._id, roomUpdate)
        }
    }
}