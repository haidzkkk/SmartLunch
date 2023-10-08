var mongoose = require('mongoose')
const categorySchema =new mongoose.Schema({
  category_name: {
    type: String,
    minLength: 3,
    maxlength: 50,
  },
  category_image: {
    type: Object,
    required: true
  },
  price_increase_percent: {
    type: Number, // % giá sản phẩm sẽ tăng nếu người dùng tự thiết kế sản phẩm (0-100%)
    required: true
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    },
  ]

},
  { timestamps: true, versionKey: false });


let categoryModel = mongoose.model("Category", categorySchema)
module.exports =categoryModel