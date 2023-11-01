var mongoose = require('mongoose')

const roomSchema = new mongoose.Schema ({
    shopUserId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    userUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    userIdSend :  {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    messSent : {type: String},
    timeSent : {type: Date, default: Date.now()},
    seen : {type: Boolean, default: false},
}, {
    collection: 'rooms'
})

let roomModel = mongoose.model('Room', roomSchema)
module.exports = roomModel
