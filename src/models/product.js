var mongoose = require('mongoose')
var mongoosePaginate = require("mongoose-paginate-v2");
var mongooseDelete = require("mongoose-delete");

const productsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    sold_quantity: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    bought: {
        type: Number,
        default: 0
    },
    rate_count: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },

},
{ timestamps: true, versionKey: false });
productsSchema.plugin(mongoosePaginate);
productsSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true }
);


let productModel = mongoose.model("Product", productsSchema)
module.exports = productModel