var mongoose = require('mongoose')

const cartSchema = new mongoose.Schema (
    {
    userId : {
        type: mongoose.Types.ObjectId, 
        ref : "Auth",
        require: true
    },
    couponId : {
        type: mongoose.Types.ObjectId, 
        ref : "Coupon",
        require: true
    },
    products :[
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            purchase_quantity: {
              type: Number,
              default: 0
            },
            sizeId: {
                type: mongoose.Types.ObjectId,
                ref: "Size",
                required: true
              },
            toppings: [
              {
                _id: {
                  type: mongoose.Types.ObjectId,
                  ref: "Topping",
                  required: true
              },
                _quantity: Number,
              }
            ]
        },
     ],
     total: {
        type: Number,
      },

      totalCoupon: {
        type: Number,
      }

}, 
{ 
  timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false }
);
let cartModel = mongoose.model('Cart', cartSchema)
module.exports = cartModel
