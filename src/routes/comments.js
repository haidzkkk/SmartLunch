var express = require('express');
var CommentController = require('../controllers/comments')
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

var router = express.Router();

router.get("/comment/:productId", CommentController.getCommentFromProduct)
router.get("/comment/:id/detail", CommentController.getOneComment)
router.post("/comment", authenticate, upload.array("images", 10), CommentController.create)

router.patch("/comment/:id", CommentController.updateComment)
router.delete("/comment/:id", CommentController.removeComment)
router.get("/comment",CommentController.getAll)
router.delete("/comment/:id/remove", CommentController.removeCommentByUser);
router.delete("/comments/:id/admin", authenticate, authorization, CommentController.removeCommentByAdmin);
router.patch("/comment/:id/update", CommentController.updateCommentByUser);
router.patch("/comments/:id/admin", authenticate, authorization, CommentController.updateCommentByAdmin);

module.exports = router;