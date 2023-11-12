var jwt = require('jsonwebtoken')
var Auth = require('../models/auth')
var category= require('../models/category')

exports.authenticate = async(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return res.status(401).json({
                message:"Bạn chưa đăng nhập!"
            })
        }
        const token = req.headers.authorization.split(" ")[1]
        const {id} = jwt.verify(token,process.env.JWT_REFRESH_KEY)
        const auth = await Auth.findById(id)
        if(!auth){
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            })
        }
        req.user = auth
        next()
    }catch(error){
        return res.status(401).json({
            message : error.message
        })
    }
}