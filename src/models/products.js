var mongoose = require('mongoose')
const productsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    }
}
, {
    collection: 'products'
}
);
let productModel = mongoose.model('product', productsSchema);

module.exports = productModel