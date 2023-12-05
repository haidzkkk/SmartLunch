var mongoose = require('mongoose')
const {format} = require('date-fns')
const { boolean } = require('joi')

const authSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        default: ""
    },
    last_name:{
        type: String,
        default: ""
    },
    gender:{
        type: Boolean,
        default: true
    },
    birthday:{
        type: String
    },
    password:{
        type: String,
        required  : true
    },
    email:{
        type:String ,
        unique: true,
        required:true
    },
    phone:{
        type: String,
        default:null
    },
    avatar:{
        type: Object
    },
    role:{
        type: String,
        default:'member'
    },
    verified: {
        type: Boolean,
        default: false
    },
    passwordChanged: {
        type: Boolean,
        default: false
    },
    googleId:{
        type: String,
        default: null,
    },
    facebookId:{
        type: String,
        default:null
    },
    authType:{
        type: String,
        enum: ['local','google', 'facebook'],
        default: 'local'
    },
    tokenFcm:{
        type:String
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:String
    },
    passwordChangeAt:{
        type:String
    },
    createdAt:{
        type: Date, 
        default: () => new Date(Date.now() + 7 * 60 * 60 * 1000)
      }
})

authSchema.virtual("formattedCreatedAt").get(function(){
    return format(this.createdAt, "HH:mm a dd/MM/yyyy")
})

let authModel = mongoose.model('Auth', authSchema)
module.exports = authModel
