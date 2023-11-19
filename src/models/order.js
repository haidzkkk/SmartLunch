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
      purchase_quantity: Number,
      sizeId: String,
      sizeName: String,
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
  shipperId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    default: null
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: "Address",
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  statusPayment: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
    default: '654892638cd8c0661be05f7c'
  },
  isPayment: {
    type: Boolean,
    default: false
  },
},

  { timestamps: true, versionKey: false });
  let orderModel= mongoose.model("Order", orderSchema)
  module.exports =orderModel