const DeliveryOrder = require('../models/delivery');
const Order = require('../models/order')
var { uploadImage } = require('../controllers/upload');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var Status = require('../models/status')
var Notification = require('../models/notification.js')
var notificationController = require('../controllers/notification')
var TYPE_ORDER = "TYPE_ORDER"

exports.createDeliveryOrder = async (req, res) => {
    try {
        const shipperId = req.user.id;
        const files = req.files;
        const formData = req.body;

        if (!formData.orderCode || !formData.status) {
            return res.status(400).json({
                message: "orderCode và status là bắt buộc"
            });
        }

        const order = await Order.findById(formData.orderCode).populate('status');
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }

        if(req.user.role != "shipper" || String(order.status._id) != "65264c672d9b3bb388078978"){
            return res.status(404).json({
                message: "Bạn không được thay đổi đơn hàng"
            });
        }

        formData.orderCode = new ObjectId(formData.orderCode);
        formData.status = new ObjectId(formData.status);

        var images = await uploadImage(files);
        if (!images || images.length === 0) {
            return res.status(400).json({
                message: "Thêm ảnh thất bại, chưa có ảnh tải lên",
            });
        }
        formData.shipperId = shipperId;
        formData.image = images[0];

        const deliveryOrder = await DeliveryOrder.create(formData);
        let isPayment = false;
        if(String(formData.status) === "6526a6e6adce6a54f6f67d7d"){ 
            isPayment = true;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            formData.orderCode,
            { status: formData.status,
                isPayment: isPayment },
            { new: true }
        ).populate('status');

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại hoặc không thể cập nhật trạng thái"
            });
        }

        await sendNotificationToUser(updatedOrder);
        
        const result = await DeliveryOrder.findById(deliveryOrder._id).populate('status');
        res.status(201).json(result);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const sendNotificationToUser = async (order) => {
    try {
        if (!order) {
            throw new Error('Invalid order data');
        }

        const orderStatus = await Status.findById(order.status);
        if (!orderStatus) {
            throw new Error('Invalid order status data');
        }

        const notificationMessage = `Đơn hàng ${order._id}. ${orderStatus.status_description}`;

        notificationController.sendNotificationToUser(order.userId, orderStatus.status_name, notificationMessage, TYPE_ORDER);

        await Notification.create({
            userId: order.userId,
            title: orderStatus.status_name,
            content: notificationMessage,
            type: TYPE_ORDER,
            idUrl: order._id
        });
    } catch (error) {
        console.error('Error sending and saving notification:', error);
        throw new Error('Failed to send and save notification');
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
