
var Comment = require("../models/comment")
var Product = require("../models/product")
var Order = require("../models/order")
var Auth = require("../models/auth")
var Size = require("../models/size")
var CommentSchema = require("../schemas/comment").CommentSchema
var { uploadImage } = require('../controllers/upload');


exports.getCommentFromProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const {
            limitPosition,
            isImage,   
            rate,   
            isSort
        } = req.query

        const queryConditions = {
            productId: productId,
          };

          if (isImage && isImage.toLowerCase() === 'true') {
            queryConditions.images = { $ne: [] };
          }
          if (rate !== null && rate !== undefined) {
            queryConditions.rating = parseInt(rate);
          }
          let sortDirection = -1;
          if (isSort && isSort.toLowerCase() === 'false') {
            sortDirection = 1; 
          }

        const comments = await Comment.find(queryConditions)
            .populate("userId")
            .sort({ createdAt: sortDirection })
            .limit(limitPosition)
            .exec();
        
        console.log(comments.length);

        return res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

exports.getRatingFromProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const comments = await Comment.find({ productId: productId })
            .populate("userId")

        var rateProduct = 0
        var indexRate = 0
        comments.forEach((comment) => {

        })

        return res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


exports.getOneComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'Không tìm thấy bình luận',
            });
        }
        return res.status(200).json({
            message: "Lấy thành công 1 bình luận",
            comment,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

exports.create = async (req, res) => {
    try {
        const commentBody = req.body;
        var files = req.files

        if (!commentBody.description) {
            commentBody.description = "Không có đánh giá"
        }

        const { error } = CommentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(401).json({
                message: errors
            })
        }

        const orderCheck = await Order.findById(commentBody.orderId).populate("status")
        if (!orderCheck) {
            return res.status(404).json({
                message: "đơn hàng không tồn tại.",
            });
        }

        // Check if the product exists
        const product = await Product.findById(commentBody.productId);
        if (!product) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại.",
            });
        }

        // Check if the product exists
        const size = await Size.findById(commentBody.sizeId);
        if (!size) {
            return res.status(404).json({
                message: "size không tồn tại.",
            });
        }
        commentBody.sizeName = size.size_name
        commentBody.sizePrice = size.size_price

        if (orderCheck.status._id != "6526a6e6adce6a54f6f67d7d") {
            return res.status(404).json({
                message: "Bạn không có điều kiện để comment.",
            });
        }

        // Check if the user already reviewed the product
        const existingComment = await Comment.findOne({
            userId: req.user._id,
            productId: commentBody.productId,
            orderId: commentBody.orderId,
            sizeId: commentBody.sizeId
        });
        if (existingComment) {
            return res.status(401).json({
                message: "Bạn đã đánh giá sản phẩm này trước đó.",
            });
        }
        commentBody.images = await uploadImage(files)
        commentBody.userId = req.user._id
        const comment = await Comment.create(commentBody)

        handleRatingProduct(comment)

        var commentPopulate = await Comment.findById(comment._id)
            .populate("userId")

        return res.status(200).json(commentPopulate);
    } catch (error) {
        console.log("Lỗi tạo comment: " + error);
        return res.status(400).json({
            message: error,
        });
    }
}


exports.updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json({
            message: 'Cập nhật bình luận thành công',
            comment
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
}


exports.removeComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Xóa comment thành công',
            comment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}


exports.getAll = async (req, res) => {
    try {
        const comments = await Comment.find().populate({
            path: 'productId',
            select: 'name',
        }).populate({
            path: 'userId',
            select: 'name email image',
        });
        return res.status(200).json({
            message: 'Lấy tất cả bình luận thành công',
            comments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
exports.updateCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { userId = '' } = req.query;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const findCommentById = await Comment.findById(id);
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            })
        }
        if (findCommentById.userId == userId) {
            const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
            if (!comment) {
                return res.status(400).json({
                    message: "Thay đổi bình luận của chính mình thất bại"
                })
            }
            return res.status(200).json({
                message: 'Thay đổi bình luận của chính mình thành công',
                comment
            });
        } else {
            return res.status(403).json({
                message: "Bạn không có quyền thay đổi bình luận này!"
            })
        }
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// Remove comment by user ( Người dùng có thể tự xóa comment của chính mình )
exports.removeCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { userId = '' } = req.query;
        const findCommentById = await Comment.findById(id);

        // Kiểm tra nếu không tìm thấy bình luận
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            });
        }

        // console.log(userId);
        // console.log(findCommentById.userId);
        if (findCommentById.userId == userId) {
            // Xóa bình luận
            const comment = await Comment.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Xóa bình luận thành công",
                comment
            });
        } else {
            // Trả về mã lỗi 403 nếu người dùng không có quyền xóa bình luận này
            return res.status(403).json({
                message: "Bạn không có quyền xóa bình luận này"
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.updateCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json({
            message: 'Admin thay đổi bình luận thành công',
            comment
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

// Remove comment by admin 
exports.removeCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const comment = await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Admin xóa bình luận thành công!',
            comment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// Tính toán số lượng sao và lươtj đánh giá
const handleRatingProduct = async (comment) => {
    const product = await Product.findById(comment.productId);
    const comments = await Comment.find({ productId: comment.productId });
    let  rateCount = 0
    let  totalRating = 0
    comments.forEach((comment) => {
        if (comment.rating > 0 && comment.rating <= 5) {
            totalRating += comment.rating
            rateCount++
        }
    });
    product.rate = totalRating / rateCount;
    product.rate_count = rateCount;
    await product.save();
}



