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
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
      },
      product_name: String,
      image: String,
      purchase_quantity: Number,
      sizeId: String,
      sizeName: String,
      product_price: Number,
      product_discount: Number,
      total: Number,
      toppings: [
        {
          _id: {
            type: mongoose.Types.ObjectId,
            ref: "Topping",
            required: true
        },
          name: String,
          price: Number,
          productId: String,
          _quantity: Number,
          total: Number,
        }
      ]
    }
  ],
  deliveryFee:{
    type: Number,
    required: false,
    default: 0
  },
  discount: {
    type: Number,
    required: false
  },
  total: {
    type: Number,
    required: true
  },
  totalAll: {
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