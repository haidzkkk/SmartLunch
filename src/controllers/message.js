var Message = require('../models/message')
var configApp = require('../config/configApp')
var sendMessageToClient = require('../controllers/socket').sendMessageToClient;

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
        const data = await Message.findById(id)        
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
        sendMessageToClient(messageAdd)
        res.status(200).json(messageAdd)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateMessage = async(req, res, next) =>{
    try{
        var id = req.params.id
        var message = req.body
        var messageUpdate = await Message.findByIdAndUpdate(id, message)
        res.status(200).json(messageUpdate)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.deleteMessage = async(req, res, next) =>{
    try{
        var id = req.params.id
        var messageDelete = await Message.findByIdAndRemove(id)
        res.status(200).json(messageDelete)  
    }catch(err){
        res.status(400).json(err)   
    }
}