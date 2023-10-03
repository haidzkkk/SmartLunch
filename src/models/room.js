var mongoose = require('mongoose')

const roomSchema = new mongoose.Schema ({
    shopUserId :  {type: mongoose.Schema.Types.ObjectId, ref: 'auth'},
    userUserId : {type: mongoose.Schema.Types.ObjectId, ref: 'auth'},
    userIdSend :  {type: mongoose.Schema.Types.ObjectId, ref: 'auth'},
    messSent : {type: String, require: true},
    timeSent : {type: Date, default: Date.now(), require: true},
    seen : {type: Boolean, default: false, require: true},
}, {
    collection: 'rooms'
})

let roomModel = mongoose.model('room', roomSchema)
module.exports = roomModel
