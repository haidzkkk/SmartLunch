// type:
// 0: không có gì
// 1: product
// 2: curpon
// 3: category
//
// url: "http://localhost:3000/api/admin/products/65502ad87ca584fe2a2d5ad7"

var mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    type: {
        type: Number,
        default: 0
    },
    img: {
        type: Object,
        required: true,
    },
    url: {
        type: String,
    }
}
, {
    collection: 'banners'
}
);
let bannerModel = mongoose.model('Banner', bannerSchema);

module.exports = bannerModel