var mongoose = require('mongoose')

const roomSchema = new mongoose.Schema ({
    shopUserId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    userUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    userIdSend :  {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    messSent : {type: String, require: true},
    timeSent : {type: Date, default: Date.now(), require: true},
    seen : {type: Boolean, default: false, require: true},
}, {
    collection: 'rooms'
})

let roomModel = mongoose.model('Room', roomSchema)
module.exports = roomModel
