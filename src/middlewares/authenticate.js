var jwt = require('jsonwebtoken')
var Auth = require('../models/auth')

exports.authenticate = async(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return res.status(203).json({
                message:"Bạn chưa đăng nhập!"
            })
        }
        const token = req.headers.authorization.split(" ")
        const {id} = jwt.verify(token[0],process.env.JWT_REFRESH_KEY)
        const auth = await Auth.findById(id)
        if(!auth){
            return res.status(203).json({
                message: "Không tìm thấy người dùng"
            })
        }
        req.user = auth
        next()
    }catch(error){
        return res.status(400).json({
            message : error.message
        })
    }
}