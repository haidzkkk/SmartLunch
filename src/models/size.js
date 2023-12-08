const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema(
  {
    size_name: {
        type: String,
        required: true
    },
    size_price: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
      },
  },
  {
    collection: 'sizes',
    timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false 
  }
);

let sizeModel = mongoose.model('Size', sizeSchema)
module.exports = sizeModel