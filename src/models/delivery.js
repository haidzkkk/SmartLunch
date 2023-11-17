const mongoose = require('mongoose');

const DeliveryOrderSchema = new mongoose.Schema({
  shipperId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    required: true
  },
  orderCode: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
    required: true
  },
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  comment: {
    type: String,
    required: false,
    default: null,
  },
  cancelReason: {
    type: String,
    required: false,
    default: null,
  }
});

const DeliveryOrder = mongoose.model('DeliveryOrder', DeliveryOrderSchema);

module.exports = DeliveryOrder;