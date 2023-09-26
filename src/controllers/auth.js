var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Auth = require('../models/auth')
var configApp = require('../config/configApp')
var authSchema = require('../schemas/auth')

exports.login = async (req, res, next) =>{
    try{
        const auth = req.body;

        const {error} = authSchema.loginSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json(errors);
        }


        const user = await Auth.findOne({email: auth.email})
        if (!user) {return res.status(404).json("Tài khoản không tồn tại");}
        if(auth.password != user.password) {return res.status(400).json("Mật khẩu không đúng");}
        res.status(200).json(generateAccessToken(user))
    }catch(err){
        res.status(400).json("login thất bại " + err.message)   
    }
}

exports.getAuth = async (req, res, next) =>{
    try{
        const data = await Auth.find()
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.addAuth = async (req, res, next) =>{
    try{
        var auth = req.body
        await Auth.create(auth)
        res.status(200).json("add thành công");
    }catch(err){
        res.status(400).json("add thất bại");
    }
}

exports.updateAuth = async (req, res, next) =>{
    try{
        var id = req.params.id
        var auth = req.body
        await Auth.findByIdAndUpdate(id, auth)
        res.status(200).json("sửa thành công");
    }catch(err){
        res.status(400).json("sửa thất bại");
    }
}

exports.deleteAuth = async (req, res, next) =>{
    try{
        var id = req.params.id
        await Auth.findByIdAndDelete(id)
        res.status(200).json("xóa thành công");
    }catch(err){
        res.status(400).json("xóa thất bại");
    }
}

// Generate Access Token 
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        configApp.JWT_ACCESS_KEY,
        { expiresIn: "2h" }
    )
}

// Generate Refresh Token 
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        configApp.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    )
}
