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
            stock_quantity: Number,
            sizeId: String,
            colorId: String
        },

     ],
     total: {
        type: Number,
      }

}, 
{
    collection: 'carts'
},
{ timestamps: true, versionKey: false }
);

module.exports = cartModel
