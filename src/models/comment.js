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
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
    required: true
  },
  sizeId: {
    type: mongoose.Types.ObjectId,
    ref: "Size",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images : {type: Array, require: false},
  rating: {
    type: Number,
    required: true
  },
  createdAt: {type: Date, 
    default: () => new Date(Date.now() + 7 * 60 * 60 * 1000)
  }
}, {
  collection: 'comments'
});


let commentModel = mongoose.model('Comment', CommentSchema)
module.exports = commentModel