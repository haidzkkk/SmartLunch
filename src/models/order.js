var mongoose = require ("mongoose");

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: false  // Đặt required là false để cho phép giá trị null
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      product_name: String,
      product_price: Number,
      image: String,
      consignee_name: String,
      purchase_quantity: Number,
      sizeId: String,
   
    }
  ],
  discount: {
    type: Number,
    required: false
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
    default: '65264bc32d9b3bb388078974'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  consignee_name: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  paymentCode: {
    type: String
  },
  payerId: {
    type: String
  }
},
  { timestamps: true, versionKey: false });
  let orderModel= mongoose.model("Order", orderSchema)
  module.exports =orderModel