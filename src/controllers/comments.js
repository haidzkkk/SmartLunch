
var Comments = require('../models/comments')


exports.addComment= async (req, res, next) =>{
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const { description, rating } = req.body;
        const newComment = new Comments({
          userId,
          productId,
          description,
          rating,
        });
        const savedComment = await newComment.save();  
        res.json(savedComment);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi thêm comment" });
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

exports.CommentProduct = async (req, res, next) =>{
    try {
        const productId = req.params.productId;
        const comments = await Comments.find({ productId });  
        res.json(comments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi lấy comment của sản phẩm" });
      }
}


exports.OneComment = async (req, res, next) =>{
    try{
        const id = req.params.id;
        const data = await Comments.findById(id);
        res.status(200).json(data)
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateComment = async (req, res, next) =>{
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const id = req.params.id;
        const { description, rating } = req.body;
        const comment = await Comments.findOne({
          _id: id,
          userId:userId,
          productId:productId 
        });
        if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
        }
        comment.description = description;
        comment.rating = rating;
        const updatedComment = await comment.save();
        res.json(updatedComment);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating comment" });
      }
}

exports.deleteComment = async (req, res, next) =>{
  const userId = req.params.userId;
  const id = req.params.id;
  const productId = req.params.productId;

  try {
    const comment = await Comments.findOneAndDelete({
      _id: id,
      userId:userId,
      productId:productId 
    });
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận" });
    }
    res.json({ message: "Xoá bình luận thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi xoá bình luận" });
  }
}




