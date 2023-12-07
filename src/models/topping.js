const mongoose = require('mongoose')

const toppingSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
  },
  {
    collection: 'toppings'
},
  { timestamps: true, versionKey: false }
);

let toppingModel = mongoose.model('Topping', toppingSchema)
module.exports = toppingModel