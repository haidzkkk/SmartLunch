const { number } = require('joi');
var mongoose = require('mongoose')
const statusSchema = new mongoose.Schema({
    status_name: {
        type: String,
        required: true,
        unique: true
    },
    status_description: {
        type: String,
        required: true,
    }
}
, {
    collection: 'statuss'
}
);
let productModel = mongoose.model('status', statusSchema);

module.exports = productModel