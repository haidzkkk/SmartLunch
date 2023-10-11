var mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    required: true
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'comments'
});

let commentModel = mongoose.model('comment', CommentSchema)
module.exports = commentModel