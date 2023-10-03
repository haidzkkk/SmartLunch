var express = require('express');
var CommentController = require('../controllers/comments')
// var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();
//all comment
router.get('/comment', CommentController.Comment);

// 1 comment
router.get('/comment/:id', CommentController.OneComment);

//get comment from product
router.get('/comment/:productId', CommentController.CommentProduct);

//creatcomment from auth id
router.post('/comment/:userId/:productId', CommentController.addComment);

//update comment 
router.put('/comment/:id/user/:userId/product/:productId', CommentController.updateComment);

//delete comment
router.delete('/comment/:id/user/:userId/product/:productId', CommentController.deleteComment);

module.exports = router;