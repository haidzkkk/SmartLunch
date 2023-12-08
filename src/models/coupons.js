var mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
    {
        coupon_name: {
            type: String,
            required: true
        },
        coupon_code: {
            type: String,
            required: true
        },
        coupon_content: {
            type: String,
            required: true
        },
        coupon_quantity: {
            type: Number,
            required: true
        },
        discount_amount: {
            type: Number,
            required: true
        },
        expiration_date: {
            type: String,
            required: true
        },
        coupon_images: {
            type: Array,
            required: true
        },
        min_purchase_amount: {
            type: Number,
            required: true
        }
    },
    {
        collection: 'coupons',
        timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false 
  }
);

let couponModel = mongoose.model('Coupon', couponSchema)
module.exports = couponModel
