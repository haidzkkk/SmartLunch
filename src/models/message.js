var mongoose = require('mongoose')

const messageSchema = new mongoose.Schema ({
    roomId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    userIdSend : {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    message : {type: String, require: true},
    linkMessage : {type: String, require: false},
    type : {type: Number, require: true},
    time : {type: Date, default: Date.now(), require: true},
}, {
    collection: 'messages'
})

let messageModel = mongoose.model('Message', messageSchema)
module.exports = messageModel
