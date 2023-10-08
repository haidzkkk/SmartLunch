var mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true
    },
    image: {
        type: Object,
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
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
    },
    materialId: {
        type: mongoose.Types.ObjectId,
        ref: "Material",
    }
},
    { timestamps: true, versionKey: false });
// productsSchema.plugin(mongoosePaginate);
// productsSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });


let productModel= mongoose.model("Product", productsSchema)
module.exports =productModel