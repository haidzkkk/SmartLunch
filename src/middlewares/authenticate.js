var configApp = require('../config/configApp')
var jwt = require('jsonwebtoken')
var Auth = require('../models/auth')

exports.authenticate = async (req, res, next) =>{
    try{
        if(!req.headers.authorization){
            return res.status(203).json("Bạn chưa đăng nhập !");
        }

        const token = req.headers.authorization.split(" ")[0]
        const { id } = jwt.verify(token, configApp.JWT_ACCESS_KEY);
        const auth = await Auth.findById(id)
        if(!auth) return res.status(203).json("Không tìm thấy người dùng");

        req.auth = auth
        next()
    }catch(err){
       return res.status(400).json("errors token: " + err.message)
    }
}