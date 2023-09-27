var express = require('express');
var CommentController = require('../controllers/comments')
// var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();
router.get('/comment', CommentController.Comment);
router.post('/comment', CommentController.addComment);
// router.put('/comment/:id', CommentController.updateComment);
// router.delete('/comment/:id', CommentController.deleteComment);

module.exports = router;