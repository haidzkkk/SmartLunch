var Favourite = require('../models/favourite')
var Product = require('../models/product')

exports.favorites = async (req, res, next) => {
    try {
        const favorites = await Favourite.find({ userId: req.user.id }).populate('userId').populate('productId');
        return res.status(200).json(favorites);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

exports.findFavorite = async (req, res, next) => {
    try {
        const favorite = await Favourite.findById(req.params.id).populate('userId').populate('productId');

        if (favorite == null) {
            res.status(400).json({ message: "Sản phẩm yêu thích không tồn tại" })
        }else {
            return res.status(200).json(favorite);
        }
     
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

exports.findProductFavorite = async (req, res, next) => {
    try {
        const favorite = await Favourite.find({ userId: req.user.id, productId: req.params.id }).populate('userId').populate('productId');

        if (favorite[0] == null) {
            res.status(400).json({ message: "Sản phẩm yêu thích không tồn tại" })
        }else {
            return res.status(200).json(favorite[0]);
        }
     
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

exports.postFavorite = async (req, res, next) => {
    try {
        var product = req.body

        const productEists = await Product.findById(product._id)
        if (productEists == null) {
            res.status(400).json({ message: "Sản phẩm không tồn tại" })
        }else {


            const favouriteEists = await Favourite.find({ userId: req.user.id, productId: product._id })
            if (favouriteEists[0] != null) {
                res.status(400).json({ message: "Bạn đã yêu thích" })
            } else {


                var favouriteAdd = await Favourite.create({
                    userId: req.user.id,
                    productId: product._id
                })

                const favouritefind = await Favourite.findById(favouriteAdd._id).populate('userId').populate('productId');
                res.status(200).json(favouritefind)
            }
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}


exports.deleteFavorite = async(req, res, next) =>{
    try{
        var id = req.params.id
        var favoriteDelete = await Favourite.findByIdAndRemove(id, { new: true }).populate('userId').populate('productId')
        
        if (favoriteDelete == null) {
            res.status(400).json({ message: "Sản phẩm yêu thích không tồn tại" })
        }else {
         res.status(200).json(favoriteDelete) 
        } 
    }catch(err){
        res.status(400).json(err)   
    }
}