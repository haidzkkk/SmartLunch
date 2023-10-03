var Room = require('../models/room')
var Auth = require('../models/auth')
var configApp = require('../config/configApp')


exports.getRoom = async(req, res, next) =>{
    try{
        const data = await Room.find()        
                            .populate('shopUserId')
                            .populate('userUserId')
                            .populate('userIdSend')
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.getRoomById = async(req, res, next) =>{
    try{
        var id = req.params.id
        const auth = await Auth.findById(id)
        if(auth != null){
            // TODO: check role để kiểm tra xem lấy id ở shopUserId hay userUserId
            // const isShop = auth.email == "admin"
            const data = await Room.find({userUserId: auth.id})        
                                .populate('shopUserId')
                                .populate('userUserId')
                                .populate('userIdSend')
            res.status(200).json(data)
        } else{
            res.status(404).json("Không tìm thấy người dùng " + auth )
        }
    }catch(err){
        res.status(400).json("Lỗi")   
    }
}

exports.postRoom = async(req, res, next) => {
    try{
        var room = req.body
        var roomAdd = await Room.create(room)
        res.status(200).json(roomAdd)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateRoom = async(req, res, next) => {
    try{
        var id = req.params.id
        var room = req.body
        var roomUpdate = await Room.findByIdAndUpdate(id, room)
        res.status(200).json(roomUpdate)  
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.deleteRoom = async(req, res, next) => {
    try{
        var id = req.params.id
        var roomDelete = await Room.findByIdAndRemove(id)
        res.status(200).json(roomDelete)  
    }catch(err){
        res.status(400).json(err)   
    }
}