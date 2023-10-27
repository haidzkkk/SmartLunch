var Message = require('../models/message')
var configApp = require('../config/configApp');
var { uploadImage } = require('../controllers/upload');
const { updateRoomSocket } = require('./room');
var { sendMessageToClient, sendRoomToClient } = require('../controllers/socket');

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
            console.log(data);
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
        console.log("anh: " + images );

        message.images = images
        message.userIdSend = req.user.id

        var messageAdd = await Message.create(message)

       var messageAddPopulate = await messageAdd.populate('userIdSend')
        console.log(messageAddPopulate);

        var roomUpdate = await updateRoomSocket(messageAdd.roomId, messageAdd.type, 
            {userIdSend: messageAdd.userIdSend, messSent: messageAdd.message, timeSent: messageAdd.time})

        // giử cho cả 2
        if(roomUpdate != null){
            sendRoomToClient(roomUpdate.shopUserId.id ,roomUpdate)
            sendRoomToClient(roomUpdate.userUserId.id ,roomUpdate)
        }
        sendMessageToClient(messageAdd.roomId, messageAdd)
    
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