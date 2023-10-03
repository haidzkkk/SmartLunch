
var Products = require('../models/products')


exports.product = async (req, res, next) =>{
    try{
        const data = await Products.find()
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}



exports.addproduct= async (req, res, next) =>{
    try{
        var products = req.body;
        await Products.create(products);
        res.status(200).json("add thành công");
    }catch(err){
        res.status(400).json("add thất bại");
    }
}