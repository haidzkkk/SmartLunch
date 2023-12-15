var mongoose = require('mongoose')

const shopSchema = new mongoose.Schema(
    {
        shop_name: {
            type: String,
            required: true
        },
        shop_number: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        ward: {
            type: String,
            required: true
        },
        shop_detail: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    {
        collection: 'shops'
    },
    { timestamps: true, versionKey: false }
);

let shopModel = mongoose.model('Shop', shopSchema)
module.exports = shopModel
