var mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema(
  {
    size_name: {
        type: String,
        required: true
    },
    size_price: {
        type: Number,
        required: true
    }
  },
  { timestamps: true, versionKey: false }
);

let sizeModel = mongoose.model('size', sizeSchema)
module.exports = sizeModel