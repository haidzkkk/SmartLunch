
var Comment = require("../models/comment")
var CommentSchema = require("../schemas/comment").CommentSchema
var Product = require("../models/product")
var Auth = require("../models/auth")



exports.getCommentFromProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await Comment.find({ productId: productId }).populate({
            path: 'userId',
            select: 'last_name email avatar',
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy theo sản phẩm bình luận',
            });
        }

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            userId: comment.userId,
            productId: comment.productId,
            description: comment.description,
            formattedCreatedAt: comment.formattedCreatedAt,
        }));

        return res.status(200).json({
            message: 'Lấy bình luận theo sản phẩm thành công',
            comments: formattedComments,
        });
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
        const { userId, rating, description, productId } = req.body;
        const { error } = CommentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        if (!userId) {
            return res.status(401).json({
              message: "Bạn phải đang nhập mới được đánh giá sản phẩm!",
            });
        }
         // Check if the product exists
        const product = await Product.findById(productId);

        if (!product) {
             return res.status(404).json({
                message: "Sản phẩm không tồn tại.",
             });
        }
          // Check if the user exists
        const user = await Auth.findById(userId);

          if (!user) {
          return res.status(404).json({
          message: "Người dùng không tồn tại.",
          });
        }

          // Check if the user already reviewed the product
    const existingComment = await Comment.findOne({ userId, productId });

        if (existingComment) {
          return res.status(401).json({
          message: "Bạn đã đánh giá sản phẩm này trước đó.",
         });
        }
        const user_fullName = user?.user_fullName;
        const user_avatar = user?.user_avatar;
        const comment = await Comment.create({
        user_fullName,
        user_avatar,
        userId,
        rating,
        description,
        productId,
    });
       const comments = await Comment.find({ productId });
        const totalRating = comments.reduce(
         (totalRating, rating) => totalRating + rating.rating,
        0
      );
     // Tính toán số lượng sao và lươtj đánh giá
        const reviewCount = comments.length;
         const averageScore = totalRating / reviewCount;
 
         product.average_score = Math.round(averageScore);
         product.review_count = reviewCount;
        await product.save();
     if (user) {
       return res.status(200).json({
         message: "Bạn đã đánh giá thành công sản phẩm này!",
         success: true,
         comment,
       });
     }
    } catch (error) {
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



