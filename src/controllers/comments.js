
var Comments = require('../models/comments')


exports.addComment= async (req, res, next) =>{
    try{
        var comments = req.body
        await Comments.create(comments)
        res.status(200).json("add thành công");
    }catch(err){
        res.status(400).json("add thất bại");
    }
}


exports.Comment = async (req, res, next) =>{
    try{
        const data = await Comments.find()
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}