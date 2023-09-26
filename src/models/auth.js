var mongoose = require('mongoose')

const authSchema = new mongoose.Schema ({
    email : {type: String, require: true},
    password : {type: String, require: true},
}, {
    collection: 'auths'
})

let authModel = mongoose.model('auth', authSchema)
module.exports = authModel
