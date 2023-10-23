var Message = require('../models/message')
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
        const data = await Message.findById(id, { new: true })        
                            .populate('roomId')
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
        var message = req.body
        var messageAdd = await Message.create(message)

        var roomEdit = await updateRoomSocket(messageAdd.roomId, messageAdd.type, 
            {userIdSend: messageAdd.userIdSend, messSent: messageAdd.message, timeSent: messageAdd.time})

        // giử cho cả 2
        if(roomEdit != null){
            sendRoomToClient(roomEdit.shopUserId ,roomEdit)
            sendRoomToClient(roomEdit.userUserId ,roomEdit)
        }     
        sendMessageToClient(messageAdd.roomId, messageAdd)
        res.status(200).json(messageAdd)  
    }catch(err){
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