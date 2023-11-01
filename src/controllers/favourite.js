var Favourite = require('../models/favourite')
var Product = require('../models/product')

exports.favorites = async (req, res) => {
    try {
        const favorites = await Favourite.find({ userId: req.user.id }).populate('userId').populate('productId');
        const productIds = favorites.map((favorite) => favorite.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.findFavorite = async (req, res, next) => {
    try {
        const favorite = await Favourite.findById(req.params.id).populate('userId').populate('productId');

        if (favorite == null) {
            res.status(400).json({ message: "Sản phẩm yêu thích không tồn tại" })
        } else {
            return res.status(200).json(favorite);
        }

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

exports.findProductFavorite = async (req, res) => {
    try {
        const favorite = await Favourite.find({ userId: req.user.id, productId: req.params.id }).populate('userId').populate('productId');

        if (favorite[0] == null) {
            res.status(400).json({ message: "Sản phẩm yêu thích không tồn tại" })
        } else {
            return res.status(200).json(favorite[0]);
        }

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

exports.postFavorite = async (req, res) => {
    try {
        const product = req.body;
        const productExists = await Product.findById(product._id);

        if (!productExists) {
            return res.status(400).json({ message: "Sản phẩm không tồn tại" });
        }

        const favouriteExists = await Favourite.findOne({ userId: req.user.id, productId: product._id });

        if (favouriteExists) {
            await Favourite.findByIdAndRemove(favouriteExists._id);
            return res.status(200).json(favouriteExists);
        } else {
            const favouriteAdd = await Favourite.create({
                userId: req.user.id,
                productId: product._id
            });

            const favouriteFind = await Favourite.findById(favouriteAdd._id)
                .populate('userId')
                .populate('productId');

            return res.status(200).json(favouriteFind);
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
