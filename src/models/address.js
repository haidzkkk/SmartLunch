const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    distance:{
        type: Number,
        default: null,
    },
    deliveryFee:{
        type: Number,
        default: null,
    },
    deliveryTime:{
        type: Number,
        default: null,
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    isRemove: {
        type: Boolean,
        default: false
    },
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
