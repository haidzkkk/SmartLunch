var mongoose = require('mongoose')

const messageSchema = new mongoose.Schema ({
    roomId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    userIdSend : {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    message : {type: String, require: true},
    linkMessage : {type: String, require: false},
    images : {type: Array, require: false},
    type : {type: Number, require: true},
    sdp : {type: Array, require: false},
    iceCandidate : {type: Array, require: false},
    // time : {type: Date, default: () => new Date(Date.now() + 7 * 60 * 60 * 1000)},
}, {
    collection: 'messages',
    timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 },
    versionKey: false
})

let messageModel = mongoose.model('Message', messageSchema)
module.exports = messageModel
