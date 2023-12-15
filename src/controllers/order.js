var Order = require("../models/order.js");
var orderSchema = require("../schemas/order").orderSchema;
var Coupon = require("../models/coupons.js");
var Product = require("../models/product");
var Address = require('../models/address');
var Cart = require('../models/cart.js');
const fetch = require('node-fetch');
var Status = require('../models/status')
var Auth = require('../models/auth.js')

var Notification = require('../models/notification.js')
var notificationController = require('../controllers/notification')
var TYPE_ORDER = "TYPE_ORDER"
const notifier = require('node-notifier');
exports.getAllOrderUI = async (req, res) => {

    res.render('order/order', {  layout: "Layouts/home" });
};


exports.getOderbyshipperUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/orders/delivering/' + req.params.id);
    const data = await response.json();
    const successfulOrders = [];
    const failedOrders = [];
    if (Array.isArray(data)) {
        data.forEach(order => {
            const orderStatus = order.status.status_name;

            if (orderStatus === "Giao hàng thành công") {
                successfulOrders.push(order);
            } else if (orderStatus === "Hủy đơn hàng thành công") {
                failedOrders.push(order);
            }
        });
    }
    res.render('user/oder_Shipper', { failedOrders, successfulOrders, layout: "Layouts/home" });
};


exports.getbyIdOrderUI = async (req, res) => {
    res.render("order/detail", { layout: "Layouts/home" });
};

exports.getbyIdOrderUI2 = async (req, res) => {
    const response = await fetch(
        "http://localhost:3000/api/order/" + req.params.id
    );
    // const data = await response.json();

    res.render("order/detail2", { layout: "Layouts/home" });
};

exports.searchOrder = async (req, res) => {

    res.render("order/search", { layout: "Layouts/home" });
};
exports.getOrderByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const statusId = req.query.statusId;
        const query = {
            userId: userId,
        }
        if (statusId) {
            query.status = statusId;
        }
        const orders = await Order.find(query).sort({ createdAt: -1 })
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment')

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
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment')
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
        const statusPaymentId = req.query.statusPaymentId;
        const query = {};
        if (statusId) {
            query.status = statusId;

            if (statusPaymentId) {
                query.statusPayment = statusPaymentId;
            }
        }
        const orders = await Order.find(query).sort({ createAt: -1 })
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        for (const order of orders) {

            // Check if order.address is not null before populating userId
            if (order.address) {
                await order.address.populate('userId');
            }

        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.updateIsPayment = async (req, res) => {
    const orderId = req.params.orderId;
    const { isPayment } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { isPayment: isPayment } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating isPayment:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
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
        if (address == null) return res.status(400).json({ message: 'Không tìm thấy address' });

        var products = []
        var myCart = await Cart.findOne({ userId: req.user.id })
            .populate('products.productId')
            .populate('products.sizeId')
            .populate('products.toppings._id');

        // kiểm tra cart và 
        if (!myCart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
        const coupon = await Coupon.findById(myCart.couponId);
        if (coupon) {
            body.couponId = coupon._id
            if (coupon.coupon_quantity > 0) {
                coupon.coupon_quantity -= 1;
                await coupon.save();
            } else {
                return res.status(404).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
            }
        }

        // tạo list products
        var totalCart = 0
        var discountCart = 0
        myCart.products.forEach((productCart) => {
            if (productCart.productId && productCart.productId.isActive) {
                var discount = 0
                var total = 0
                var totalToppings = 0

                // add toppings
                var toppings = []
                productCart.toppings.forEach((toppingCart) => {
                    if(toppingCart && toppingCart._id && toppingCart._id.isActive && toppingCart._quantity > 0 ){
                        totalToppings += toppingCart._id.price * toppingCart._quantity
                        var toppingOrder = {
                            _id: toppingCart._id._id,
                            name: toppingCart._id.name,
                            price: toppingCart._id.price,
                            productId: toppingCart._id.productId,
                            _quantity: toppingCart._quantity,
                            total: totalToppings
                        }
                        toppings.push(toppingOrder)
                    }
                })

                // add products
                total = productCart.sizeId.size_price * productCart.purchase_quantity
                const newProductOrder = {
                    productId: productCart.productId._id,
                    image: productCart.productId.images[0].url,
                    product_name: productCart.productId.product_name,
                    purchase_quantity: productCart.purchase_quantity,
                    sizeId: productCart.sizeId._id,
                    sizeName: productCart.sizeId.size_name,
                    product_price: productCart.sizeId.size_price,
                    product_discount: discount,
                    total: total + totalToppings,
                    toppings: toppings
                };
                products.push(newProductOrder);
                totalCart += newProductOrder.total
            }
        })

        if (products.length <= 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong đơn hàng' });
        }


        // tính toán nếu có giảm giá
        if (coupon) {
            if (0 < coupon.discount_amount && coupon.discount_amount <= 100) {
                discountCart = (totalCart / 100) * coupon.discount_amount
            } else if (0 < coupon.discount_amount && coupon.discount_amount > 1000) {
                discountCart = coupon.discount_amount
            }
        }

        body.products = products
        body.deliveryFee = address.deliveryFee
        body.total = totalCart
        body.discount = discountCart
        body.totalAll = totalCart - discountCart + address.deliveryFee

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

        handleBoughtProduct(order)

        const result = await Order.findById(order._id)
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment')


        result.address = await result.address.populate('userId')

        notifier.notify(
            {
                title: 'Đơn hàng mới kìa ông chủ ',
                message: 'Có đơn hàng mới !',

            },
            function (err, response, metadata) {
                // Handle callback if needed
            }
        );

        return res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: error.message
        });
    }
}

// exports.searchOrder = async (req, res) => {


// cập nhật
exports.updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const shipperId = req.query.shipperId
        const body = req.body;
        if (shipperId) {
            body.shipperId = shipperId;
        }

        const status = await Status.findById(body.status)
        if (!status) {
            return res.status(404).json({
                message: "trạng thái không tồn tại"
            });
        }

        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }

        if (String(status._id) == "653bc0a72006e5791beab35b") {
            if (req.user.role == "member" && String(order.status) != "65264bc32d9b3bb388078974") {
                return res.status(404).json({
                    message: "Bạn không được hủy đơn hàng"
                });
            }

        }
        order.status = status._id

        if (shipperId && !order.shipperId) {
            order.shipperId = shipperId;
        } else if (shipperId && order.shipperId) {
            return res.status(404).json({
                message: "Đơn hàng đã được nhận trước đó"
            });
        }

        var updatedOrder = await updateOrderById(order._id, order)
        const notificationMessage = await createNotificationMessage(updatedOrder);
        await sendNotificationToUser(updatedOrder, notificationMessage);
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
};

const updateOrderById = async (id, body) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true })
        .populate('userId')
        .populate('status')
        .populate('address')
        .populate('statusPayment');

    if (!updatedOrder) {
        throw new Error("Đơn hàng không tồn tại");
    }

    updatedOrder.address = await updatedOrder.address.populate('userId');
    return updatedOrder;
};

const createNotificationMessage = async (order) => {
    const orderStatus = await Status.findById(order.status);
    if (order.shipperId) {
        return `Đơn hàng ${order._id} shipper đã nhận đơn. ${orderStatus.status_description}`;
    } else {
        return `Đơn hàng ${order._id}. ${orderStatus.status_description}`;
    }
};

const sendNotificationToUser = async (order, message) => {
    try {
        const orderStatus = await Status.findById(order.status);
        notificationController.sendNotificationToUser(order.userId, orderStatus.status_name, message, TYPE_ORDER);
        await Notification.create({
            userId: order.userId,
            title: orderStatus.status_name,
            content: message,
            type: TYPE_ORDER,
            idUrl: order._id
        });
    } catch (error) {
        console.error('Error sending and saving notification:', error);
        throw new Error('Failed to send and save notification');
    }
};

// truyển thành đã thanh toán
exports.updatePaymentOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const isPayment = req.query.isPayment
        const order = await Order.findByIdAndUpdate(id, { isPayment: isPayment }, { new: true })
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


exports.getTop5shipperSucsses = async (req, res) => {
    try {
        const statusId = req.query.statusId;
        const statusPaymentId = req.query.statusPaymentId;
        const query = {};
        if (statusId) {
            query.status = statusId;

            if (statusPaymentId) {

                query.statusPayment = statusPaymentId;
            }
        }
        const orders = await Order.find(query)
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        for (const order of orders) {

            // Check if order.address is not null before populating userId
            if (order.address) {
                await order.address.populate('userId');
            }

        }
        const successfulOrders = orders.filter(order => order.status.status_name === 'Giao hàng thành công');

        // Count the number of orders for each shipper
        const shipperOrderCount = {};
        successfulOrders.forEach(order => {
            if (order.shipperId) {
                shipperOrderCount[order.shipperId] = (shipperOrderCount[order.shipperId] || 0) + 1;
            }
        });
        // Sort shippers by order count in descending order
        const sortedShippers = Object.keys(shipperOrderCount).sort((a, b) => shipperOrderCount[b] - shipperOrderCount[a]);

        // Get the top 5 shippers
        const top5Shippers = sortedShippers.slice(0, 5);
        const shippers = await Auth.find({
            _id: { $in: top5Shippers }
        });

        return res.json(shippers);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.getTop5shipperFail = async (req, res) => {
    try {
        const statusId = req.query.statusId;
        const statusPaymentId = req.query.statusPaymentId;
        const query = {};
        if (statusId) {
            query.status = statusId;

            if (statusPaymentId) {

                query.statusPayment = statusPaymentId;
            }
        }
        const orders = await Order.find(query)
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment');

        for (const order of orders) {

            // Check if order.address is not null before populating userId
            if (order.address) {
                await order.address.populate('userId');
            }

        }
        const successfulOrders = orders.filter(order => order.status.status_name === 'Hủy đơn hàng thành công');

        // Count the number of orders for each shipper
        const shipperOrderCount = {};
        successfulOrders.forEach(order => {
            if (order.shipperId) {
                shipperOrderCount[order.shipperId] = (shipperOrderCount[order.shipperId] || 0) + 1;
            }
        });
        // Sort shippers by order count in descending order
        const sortedShippers = Object.keys(shipperOrderCount).sort((a, b) => shipperOrderCount[b] - shipperOrderCount[a]);

        // Get the top 5 shippers
        const top5Shippers = sortedShippers.slice(0, 5);
        const shippers = await Auth.find({
            _id: { $in: top5Shippers }
        });

        return res.json(shippers);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user._id, status: "6526a6e6adce6a54f6f67d7d"})
        var arrayProductOrder = []
        orders.forEach((order) =>{
            arrayProductOrder.push(...order.products)
        })
        console.log(arrayProductOrder.length);
        return res.status(200).json(arrayProductOrder)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

const handleBoughtProduct = async (order) => {
    try {
        await order.populate('products.productId');

        for (const product of order.products) {
            const productId = product.productId;

            // Kiểm tra xem productId có tồn tại không trước khi cập nhật
            if (productId) {
                const views = productId.bought + product.purchase_quantity;
                productId.bought = views;
                await productId.save();
            }
        }
        console.log("Updated product bought values successfully.");
    } catch (error) {
        console.error("Error updating product bought values:", error);
    }
}

//tạo order
exports.createOrderCartLocal = async (req, res) => {
    try {
        const myCart = req.body.cart;
        const body = req.body.data;
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
        if (address == null) return res.status(400).json({ message: 'Không tìm thấy address' });

        var products = []

        // kiểm tra cart và 
        if (!myCart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
        const coupon = await Coupon.findById(myCart.couponId);
        if (coupon) {
            body.couponId = coupon._id
            if (coupon.coupon_quantity > 0) {
                coupon.coupon_quantity -= 1;
                await coupon.save();
            } else {
                return res.status(404).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
            }
        }

        // tạo list products
        var totalCart = 0
        var discountCart = 0
        myCart.products.forEach((productCart) => {
            if (productCart.productId && productCart.productId.isActive) {
                var discount = 0
                var total = 0
                var totalToppings = 0

                // add toppings
                var toppings = []
                productCart.toppings.forEach((toppingCart) => {
                    if(toppingCart && toppingCart._id && toppingCart._id.isActive && toppingCart._quantity > 0 ){
                        totalToppings += toppingCart._id.price * toppingCart._quantity
                        var toppingOrder = {
                            _id: toppingCart._id._id,
                            name: toppingCart._id.name,
                            price: toppingCart._id.price,
                            productId: toppingCart._id.productId,
                            _quantity: toppingCart._quantity,
                            total: totalToppings
                        }
                        toppings.push(toppingOrder)
                    }
                })

                // add products
                total = productCart.sizeId.size_price * productCart.purchase_quantity
                const newProductOrder = {
                    productId: productCart.productId._id,
                    image: productCart.productId.images[0].url,
                    product_name: productCart.productId.product_name,
                    purchase_quantity: productCart.purchase_quantity,
                    sizeId: productCart.sizeId._id,
                    sizeName: productCart.sizeId.size_name,
                    product_price: productCart.sizeId.size_price,
                    product_discount: discount,
                    total: total + totalToppings,
                    toppings: toppings
                };
                products.push(newProductOrder);
                totalCart += newProductOrder.total
            }
        })

        if (products.length <= 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong đơn hàng' });
        }


        // tính toán nếu có giảm giá
        if (coupon) {
            if (0 < coupon.discount_amount && coupon.discount_amount <= 100) {
                discountCart = (totalCart / 100) * coupon.discount_amount
            } else if (0 < coupon.discount_amount && coupon.discount_amount > 1000) {
                discountCart = coupon.discount_amount
            }
        }

        body.products = products
        body.deliveryFee = address.deliveryFee
        body.total = totalCart
        body.discount = discountCart
        body.totalAll = totalCart - discountCart + address.deliveryFee

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

        handleBoughtProduct(order)

        const result = await Order.findById(order._id)
            .populate('userId')
            .populate('status')
            .populate('address')
            .populate('statusPayment')


        result.address = await result.address.populate('userId')

        notifier.notify(
            {
                title: 'Đơn hàng mới kìa ông chủ ',
                message: 'Có đơn hàng mới !',

            },
            function (err, response, metadata) {
                // Handle callback if needed
            }
        );

        return res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: error.message
        });
    }
}
exports.getOrdersSortedByPrice = async (req, res) => {
    try {
      // Fetch orders from the database and sort by 'total' field in descending order
      const orders = await Order.find()
        .sort({ total: -1 })
        .populate('userId')
        .populate('status')
        .populate({
          path: 'address',
          populate: { path: 'userId' }
        })
        .populate('statusPayment');
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  exports.getOrdersSortedByName = async (req, res) => {
    try {
      // Lấy đơn hàng từ cơ sở dữ liệu và sắp xếp theo trường 'products.product_name' theo thứ tự chữ cái (tiếng Việt)
      const orders = await Order.find()
        .collation({ locale: 'vi', strength: 2 }) // Sử dụng collation để sắp xếp theo thứ tự chữ cái tiếng Việt
        .sort({ 'products.product_name': 1 }) // 1 cho thứ tự chữ cái tăng dần, -1 cho thứ tự chữ cái giảm dần
        .populate('userId')
        .populate('status')
        .populate({
          path: 'address',
          populate: { path: 'userId' }
        })
        .populate('statusPayment');
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi Server Nội Bộ' });
    }
  };
  
  
