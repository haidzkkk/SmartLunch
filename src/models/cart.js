var mongoose = require('mongoose')

const cartSchema = new mongoose.Schema (
    
    {
    userId : {
        type: mongoose.Types.ObjectId, 
        ref : "Auth",
        require: true
    }
        ,
        couponId : {
        type: mongoose.Types.ObjectId, 
        ref : "Coupon",
        require: true
    },
    products :[
        {
            productId: String,
            product_name: String,
            product_price: Number,
            image: String,
            purchase_quantity: Number,
            sizeId: String,
            sizeName : String,
        },
     ],
     total: {
        type: Number,
      }

}, 

{ timestamps: true, versionKey: false }
);
let cartModel = mongoose.model('Cart', cartSchema)
module.exports = cartModel
