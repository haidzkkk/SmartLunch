const DeliveryOrder = require('../models/delivery');
const Order = require('../models/order')
var { uploadImage } = require('../controllers/upload');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createDeliveryOrder = async (req, res) => {
    try {
        const shipperId = req.user.id;
        const files = req.files;
        const formData = req.body;

        formData.orderCode = new ObjectId(formData.orderCode);
        formData.status = new ObjectId(formData.status);

        var images = await uploadImage(files);
        if (images[0] == null) {
            return res.status(400).json({
                message: "Thêm ảnh thất bại, chưa có ảnh tải lên",
            });
        }
        formData.shipperId = shipperId;
        formData.image = images[0];

        const deliveryOrder = await DeliveryOrder.create(formData);

        await Order.updateOne(
            { _id: formData.orderCode },
            { $set: { status: formData.status } }
        );
        const result = await DeliveryOrder.findById(deliveryOrder._id).populate('status' )
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};


exports.getAllDeliveryOrders = async (req, res) => {
    try {
        const shipperId = req.user.id
        const statusId = req.query.statusId
        const query = {
            shipperId: shipperId,
        };
        if (statusId) {
            query.status = statusId;
        }
        const deliveryOrders = await DeliveryOrder.find(query).populate('status' );
        res.status(200).json(deliveryOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi! máy chủ không phản hồi' });
    }
};

exports.getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const deliveryOrder = await DeliveryOrder.findById(id).populate('status' )
        return res.status(200).json(deliveryOrder);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}
