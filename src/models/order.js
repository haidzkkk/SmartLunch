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
    default: null
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
      sizeName:String,
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