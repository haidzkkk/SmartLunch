var Room = require('../models/room')
var Auth = require('../models/auth')
const { el } = require('date-fns/locale')


// exports.getRoom = async(req, res, next) =>{
//     try{
//         const data = await Room.find()        
//                             .populate('shopUserId')
//                             .populate('userUserId')
//                             .populate('userIdSend')
//         res.status(200).json(data)
//     }catch(err){
//         res.status(400).json("Lỗi " + err)   
//     }
// }

// lấy room theo id người dùng
exports.getRoomById = async(req, res, next) =>{
    try{
        const auth = await Auth.findById(req.user.id)
        if(auth != null){
            // TODO: check role để kiểm tra xem lấy id ở shopUserId hay userUserId
            // const isShop = auth.email == "admin"
            console.log(auth.id);
            const data = await Room.find({$or: [{ userUserId: auth.id },{ shopUserId: auth.id }]})        
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
        var roomUpdate = await Room.findByIdAndUpdate(id, room, { new: true })
        if(roomUpdate == null){
            res.status(404).json("not found")  
        }else{
            res.status(200).json(roomUpdate)  
        }
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateRoomSocket = async (id, type, room) =>{
    try{
        if(type != 0) room.messSent = "type khác"
        console.log(room);
        var roomUpdate = await Room.findByIdAndUpdate(id, room, { new: true }).populate('shopUserId')
        .populate('userUserId')
        .populate('userIdSend')
        if(roomUpdate != null){
            return roomUpdate
        }else{
            return null
        }
    }catch(err){
        return null
        console.log(err);
    }
} 

exports.deleteRoom = async(req, res, next) => {
    try{
        var id = req.params.id
        var roomDelete = await Room.findByIdAndRemove(id, { new: true })
        if(roomDelete == null){
            res.status(404).json("not found")  
        }else{
            res.status(200).json(roomDelete)  
        }
    }catch(err){
        res.status(400).json(err)   
    }
}