var Order = require("../models/order.js");
var orderSchema = require("../schemas/order").orderSchema;
var Coupon = require("../models/coupons.js");
var Product = require("../models/product");
const fetch = require('node-fetch');
var Address = require('../models/address'); 
var Status = require('../models/status')

exports.getAllOrderUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/getAllorder');
    const data = await response.json();
    res.render('order/order', { data ,layout :"Layouts/home"});
};

exports.getOderbyshipperUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/orders/delivering/'+ req.params.id);
    const data = await response.json(); 
    const successfulOrders = [];
    const failedOrders = [];
    if (Array.isArray(data)) {
    data.forEach(order => {
      const orderStatus = order.status.status_name;
    
      if (orderStatus === "Giao hàng thành công" ) {
        successfulOrders.push(order);
      } else if (orderStatus === "Hủy đơn hàng thành công") {
        failedOrders.push(order);
      }
    });
}
    res.render('user/oder_Shipper', { failedOrders, successfulOrders,layout :"Layouts/home"});
};

exports.getbyIdOrderUI = async (req, res) => {
    const response = await fetch(
      "http://localhost:3000/api/order/" + req.params.id
    );
    const data = await response.json();
    res.render("order/detail", { data, layout: "Layouts/home" });
  };


exports.getbyIdOrderUI = async (req, res) => {
    const response = await fetch(
      "http://localhost:3000/api/order/" + req.params.id
    );
    const data = await response.json();
    res.render("order/detail", { data, layout: "Layouts/home" });
  };

// lấy thông tin về các đơn hàng của một người dùng dựa trên ID của người dùng
exports.getOrderByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const statusId = req.query.statusId;
        const query = {
            userId: userId,
        };
        if (statusId) {
            query.status = statusId;
        }
        const orders = await Order.find(query)
        .populate('products.productId')
        .populate('userId')
        .populate('status')
        .populate('address')
        .populate('statusPayment');

    for (const order of orders) {
        await order.address.populate('userId');
    }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// lấy thông tin về các đơn hàng của shipper đã nhận
exports.getOrderByShipper = async (req, res) => {
    try {
        const shipperId = req.user.id;
        const statusId = req.query.statusId;
        const query = {
            shipperId: shipperId,
        };
        if (statusId) {
            query.status = statusId;
        }
        const orders = await Order.find(query)
            .populate('products.productId')
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        for (const order of orders) {
            await order.address.populate('userId');
        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.getOrderByShipperId = async (req, res) => {
    try {
        const shipperId = req.params.id;
        const statusId = req.query.statusId;
        const query = {
            shipperId: shipperId,
        };
        if (statusId) {
            query.status = statusId;
        }
        const orders = await Order.find(query)
            .populate('products.productId')
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        for (const order of orders) {
            await order.address.populate('userId');
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


// lấy đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const order = await Order.findById(id)
        .populate('products.productId')
        .populate('userId')
        .populate('status')
        .populate('address')
        .populate('statusPayment')
        order.address = await order.address.populate('userId')
        
        if (!order || order.length === 0) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json(order)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//lấy tất cả đơn hàng
exports.getAllOrder = async (req, res) => {
    try {
        const statusId = req.query.statusId;
        const query = {};
        if (statusId) {
            query.status = statusId;
        }
        const orders = await Order.find(query)
            .populate('products.productId')
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        // for (const order of orders) {
        //     await order.address.populate('userId');
        // }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


// xóa order
exports.removeOrder = async (req, res) => {
    try {
        // Tìm đơn hàng để lấy thông tin sản phẩm đã mua
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }
        // Lặp qua từng sản phẩm trong đơn hàng và cập nhật lại số lượng sản phẩm và view
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Tăng số lượng sản phẩm lên theo số lượng đã hủy
                product.stock_quantity += item.stock_quantity;
                // Giảm số lượng đã bán (view) đi theo số lượng đã hủy
                product.sold_quantity -= item.stock_quantity;
                await product.save();
            }
        }
        await Order.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Xóa đơn hàng thành công!",
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//tạo order
exports.createOrder = async (req, res) => {
    try {
        const body = req.body;
        body.userId = req.user.id
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        // check address có tồn tại
        const address = await Address.findOne({ _id: body.address, isRemove: false });
        if(address == null) return res.status(400).json({ message: 'Không tìm thấy address' });

        // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
        if (body.couponId !== null) {
            // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
            const coupon = await Coupon.findById(body.couponId);
            if (coupon) {
                if (coupon.coupon_quantity > 0) {
                    coupon.coupon_quantity -= 1;
                    await coupon.save();
                } else {
                    return res.status(400).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
                }
            }
        }

        // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và view
        for (const item of body.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Giảm số lượng sản phẩm tương ứng với số lượng mua
                product.purchase_quantity -= item.purchase_quantity; // Giảm số lượng theo số lượng trong giỏ hàng
                // Tăng số lượng đã bán (view) tương ứng với số lượng mua
                product.purchase_quantity += item.purchase_quantity; // Tăng view theo số lượng trong giỏ hàng
                await product.save();
            }
        }

        const order = await Order.create(body)
        if (!order) {
            return res.status(404).json({
                error: "Đặt hàng thất bại "
            })
        }

        const result = await Order.findById(order._id)
        .populate('products.productId')
        .populate('userId')
        .populate('status')
        .populate('address')
        .populate('statusPayment')
        result.address = await result.address.populate('userId')

        return res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: error.message
        });
    }
}


// cập nhật
exports.updateOrder = async (req, res) => {
    try {

        const id = req.params.id;
        const shipperId = req.query.shipperId
        const body = req.body;

        // Tìm đơn hàng dựa trên ID
        const order = await Order.findById(id)
            .populate('products.productId')
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }

        // Kiểm tra nếu shipperId null thì mới cập nhật
        if (shipperId && !order.shipperId) {
            body.shipperId = shipperId;
        }else if(shipperId && order.shipperId){
            return res.status(404).json({
                message: "Đơn hàng đã được nhận trước đó"
            })
        }
       
        const orderUpdate = await Order.findByIdAndUpdate(id, body, { new: true })
        .populate('products.productId')
        .populate('userId')
        .populate('status')
        .populate('address')
        .populate('statusPayment')
        orderUpdate.address = await orderUpdate.address.populate('userId')
        if (!orderUpdate) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json(orderUpdate)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// truyển thành đã thanh toán
exports.updatePaymentOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const isPayment = req.query.isPayment
        const order = await Order.findByIdAndUpdate(id, {isPayment: isPayment}, { new: true })
            .populate('products.productId')
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment')
            order.address = await order.address.populate('userId')

        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }

        return res.status(200).json(order)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
