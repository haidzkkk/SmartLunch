var mongoose = require('mongoose')
const {format} = require('date-fns')

const authSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        required : true
    },
    last_name:{
        type: String,
        required :true
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
        required: true
    },
    address:{
        type: String,
        required: true
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
        default:Date.now()
    },
    avatar:{
        type: Object
    }
})

authSchema.virtual("formattedCreatedAt").get(function(){
    return format(this.createdAt, "HH:mm a dd/MM/yyyy")
})

let authModel = mongoose.model('Auth', authSchema)
module.exports = authModel
