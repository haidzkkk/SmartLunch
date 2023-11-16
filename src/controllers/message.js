var Message = require('../models/message')
var configApp = require('../config/configApp');
var { uploadImage } = require('../controllers/upload');
const { updateRoomSocket } = require('./room');
var { sendMessageToClient, sendRoomToClient } = require('../controllers/socket');
var notificationController = require('../controllers/notification')

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

exports.postMessage = async(req, res, next) =>{
    try{
        var files = req.files 
        var message = req.body

        var images = await uploadImage(files)

        message.images = images
        message.userIdSend = req.user.id

        var messageAdd = await Message.create(message)

       var messageAddPopulate = await messageAdd.populate('userIdSend')
        console.log(messageAddPopulate);

        var roomUpdate = await updateRoomSocket(messageAdd.roomId, messageAdd.type, 
            {userIdSend: messageAdd.userIdSend, messSent: messageAdd.message, timeSent: messageAdd.time})

        // giử data socket cho cả 2
        sendMessageToClient(messageAdd.roomId, messageAdd)
        if(roomUpdate != null){
            sendRoomToClient(roomUpdate)
            

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