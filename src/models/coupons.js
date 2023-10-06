var mongoose = ('mongoose')

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
            type: Date,
            required: true
        },
        min_purchase_amount: {
            type: Number,
            required: true
        }
    },
    { timestamps: true, versionKey: false }
);

let couponModel = mongoose.model('Coupon', couponSchema)
module.exports = couponModel
