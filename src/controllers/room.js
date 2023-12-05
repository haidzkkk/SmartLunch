var Room = require('../models/room')
var Auth = require('../models/auth')
const { el, da } = require('date-fns/locale');
const roomModel = require('../models/room');


exports.getRoomsByUserId = async (req, res, next) => {
    try {
        var curentUser = req.user

        const data = await Room.find({ $or: [{ userUserId: curentUser.id }, { shopUserId: curentUser.id }] })
            .populate('shopUserId')
            .populate('userUserId')
            .populate('userIdSend')
            .sort({ timeSent: -1 })

            // trả về cho người lấy danh sách auto là userUserId còn ng chat cùng là shopUerID
            data.forEach((room) =>{
                if(curentUser && room.userUserId  && curentUser.id != room.userUserId._id){
                    const temp = room.shopUserId;
                    room.shopUserId = room.userUserId;
                    room.userUserId = temp;
                }
            })
        
            console.log(data);
        res.status(200).json(data)

    } catch (err) {
        console.log(err);
        res.status(400).json("Lỗi")
    }
}

exports.getRoomByUserId = async (req, res, next) => {
    try {
        var curentUserId = req.user.id
        var withUserId = req.params.id

        const data = await Room.find({
            $or: [
              { shopUserId: curentUserId, userUserId: withUserId },
              { shopUserId: withUserId, userUserId: curentUserId }
            ]
          })
            .populate('shopUserId')
            .populate('userUserId')
            .populate('userIdSend')

            // trả về cho người lấy danh sách auto là userUserId còn ng chat cùng là shopUerID
            if(data[0] == null){
                var withUser = await Auth.findById(withUserId)
                if(!withUser){
                    return res.status(404).json("Không tìm thấy người dùng")
                }
                var roomAdd = await Room.create({
                    shopUserId: withUserId,
                    userUserId: curentUserId,
                })

                var roomAddPopu = await Room.findById(roomAdd.id)
                .populate('shopUserId')
                .populate('userUserId')
                .populate('userIdSend')

                return res.status(200).json(roomAddPopu)
            }

            data.forEach((room) =>{
                if(curentUserId != room.userUserId._id){
                    const temp = room.shopUserId;
                    room.shopUserId = room.userUserId;
                    room.userUserId = temp;
                }
            })
            res.status(200).json(data[0])
    } catch (err) {
        console.log(err);
        res.status(400).json("Lỗi")
    }
}

exports.getRoomById = async (req, res, next) => {
    try {
        var curentUser = req.user

        const data = await Room.findById(req.params.id)
        .populate('shopUserId')
        .populate('userUserId')
        .populate('userIdSend')

        if(data != null){
            if(curentUser && data.userUserId  && curentUser.id != data.userUserId._id){
                const temp = data.shopUserId;
                data.shopUserId = data.userUserId;
                data.userUserId = temp;
            }
            res.status(200).json(data)
        }else{
            res.status(404).json("not found") 
        }


    } catch (err) {
        console.log(err);
        res.status(400).json("Lỗi")
    }
}

exports.postRoom = async (req, res, next) => {
    try {
        var room = req.body
        var roomAdd = await Room.create(room)
        res.status(200).json(roomAdd)
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateRoom = async (req, res, next) => {
    try {
        var id = req.params.id
        var room = req.body
        var roomUpdate = await Room.findByIdAndUpdate(id, room, { new: true })
        if (roomUpdate == null) {
            res.status(404).json("not found")
        } else {
            res.status(200).json(roomUpdate)
        }
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateRoomSocket = async (id, type, room) => {
    try {
        if (type == 0) {

        }else if(type == 1){
            room.messSent = "Đã gửi ảnh"
        }
        else if(type == 11){
            room.messSent = "Đang có cuộc gọi"
        }
        else if(type == 12){
            room.messSent = "Cuộc gọi đã kết thúc"
        }
        
        var roomUpdate = await Room.findByIdAndUpdate(id, room, { new: true }).populate('shopUserId')
            .populate('userUserId')
            .populate('userIdSend')
        if (roomUpdate != null) {
            return roomUpdate
        } else {
            return null
        }
    } catch (err) {
        return null
        console.log(err);
    }
}

exports.deleteRoom = async (req, res, next) => {
    try {
        var id = req.params.id
        var roomDelete = await Room.findByIdAndRemove(id, { new: true })
        if (roomDelete == null) {
            res.status(404).json("not found")
        } else {
            res.status(200).json(roomDelete)
        }
    } catch (err) {
        res.status(400).json(err)
    }
}