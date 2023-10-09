var Order = require ("../models/order.js");
var orderSchema = require ("../schemas/order");
var Coupon = require ("../models/coupons.js");
var product = require ("../models/products.js");


// lấy thông tin về các đơn hàng của một người dùng dựa trên ID của người dùng
exports.getOrderByUserId = async (req, res) =>{

    try {
        const id  = req.params.userId;
        const order = await Order.find({userId :id}).populate('products.productId status');
        res.status(200).json(order).json({
            message :"Lấy thông tin người dùng đặt hàng thành công",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message :error.message,
            
        })
    }
}

// lấy đơn hàng
 exports.getOrderById = async (req, res) =>{
    try {
        const id = req.params.id
        const order = await Order.findById(id).populate('products.productId status')
        if(!order|| order.length ===0){
            return res.status(400).json({
                message :'đơn hàng không tồn tại'
            })
        }
        res.status(200).json(order).json({
            message :"Lấy 1  đơn hàng thành công",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message :error.message,
            
        })
      
    }
 }
 exports.getAllOrder = async (req, res) => {
    try {
        const order = await Order.find().populate('products.productId status')
        if(!order){
            return res.status(400).json({
                message :'lấy tất cả đơn hàng thất bại '
            })
        }
        res.status(200).json(order).json({
            message :"Lấy tất cả đơn hàng thành công",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message :error.message,
    
        })
    }
 }
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

exports.createOrder = async (req, res) => {
    try {
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

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
                product.stock_quantity -= item.stock_quantity; // Giảm số lượng theo số lượng trong giỏ hàng
                // Tăng số lượng đã bán (view) tương ứng với số lượng mua
                product.sold_quantity += item.stock_quantity; // Tăng view theo số lượng trong giỏ hàng
                await product.save();
            }
        }

        const order = await Order.create(body);
        if (!order) {
            return res.status(404).json({
                error: "Đặt hàng thất bại"
            })
        }

        return res.status(200).json({
            message: "Đặt hàng thành công",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}



exports.updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const order = await Order.findByIdAndUpdate(id, body, { new: true }).populate('products.productId status')
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            orderUpdateSuccess: order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
