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
    }
  },
  {
    collection: 'sizes'
},
  { timestamps: true, versionKey: false }
);

let sizeModel = mongoose.model('Size', sizeSchema)
module.exports = sizeModel