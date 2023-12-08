var Cart = require("../models/cart")
var Auth = require("../models/auth")
var mongoose = require("mongoose")
var Coupon = require("../models/coupons")
// var order = require("../models/order")
var cartSchema = require("../schemas/cart").cartSchema
var Product = require("../models/product")
var Size = require("../models/size")
var Topping = require("../models/topping")
const { el } = require("date-fns/locale")
const fetch = require('node-fetch');


const ressetCart = async (idUser) =>{
    try {
        const cartExist = await Cart.findOne({userId:idUser})
        const productsUpdated = []
        cartExist.products = productsUpdated
        const cartUpdated = await Cart.findByIdAndUpdate({_id: cartExist._id}, cartExist,{new :true})
        await cartUpdated.populate("couponId").populate("userId")
     return cartUpdated

    } catch (error) {
         console.log(error.message)
        return {}
    }
}


const addProductToCart = async (cartExist, productCart) => {
    try {
        const productExistIndex = cartExist.products.findIndex((product) =>
            String(product.productId._id) === String(productCart.productId) &&
            String(product.sizeId._id) === String(productCart.sizeId)
        );

        if (productExistIndex !== -1) {
            const existingProduct = cartExist.products[productExistIndex];
            if(existingProduct.productId.isActive && existingProduct.purchase_quantity + productCart.purchase_quantity >= 0){
                existingProduct.purchase_quantity += productCart.purchase_quantity;
                await addToppingToProducCart(existingProduct, productCart.toppings)
            }

        } else {
            if(productCart.purchase_quantity >= 0){
                const newProductCart = {
                    productId: productCart.productId,
                    purchase_quantity: productCart.purchase_quantity,
                    sizeId: productCart.sizeId,
                    toppings: []
                };
                await addToppingToProducCart(newProductCart, productCart.toppings)
                cartExist.products.push(newProductCart);
            }
        }
     
    // Lưu giỏ hàng sau khi cập nhật (không có phiếu giảm giá)

    await handleTotalCart(cartExist)
    await handleCouponTotal(cartExist)
    await cartExist.save();

    return cartExist;
    } catch (error) {
        throw error;
    }
};

const addToppingToProducCart = async (productCart, toppings) => {
    const toppingsToPopulate = await Promise.all(toppings.map(async (item) => {
        const toppingPopulate = await Topping.findById(item._id);
        return {
          _id: toppingPopulate,
          _quantity: item._quantity
        };
      }));

    toppingsToPopulate.forEach((toppingCartReq) =>{
        if(toppingCartReq._id && toppingCartReq._id.isActive && toppingCartReq._quantity > 0){

            const existingToppingIndex = productCart.toppings.findIndex((existingTopping) => 
                String(existingTopping._id._id) == String(toppingCartReq._id._id)
            );

            if (existingToppingIndex !== -1) {
                console.log("add topping " + toppingCartReq._id._id + toppingCartReq._quantity);
                productCart.toppings[existingToppingIndex]._quantity += toppingCartReq._quantity;
            }else{
                console.log("push topping " + toppingCartReq._id._id + toppingCartReq._quantity);
                productCart.toppings.push({
                    _id: toppingCartReq._id._id,
                    _quantity: toppingCartReq._quantity,
                }) 
            }
        }
    })
}

exports.createCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productCartAdd = req.body;
        const userExist = await Auth.findById(userId);

        if (!userExist) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại!',
            });
        }

        // const { error } = cartSchema.validate(req.body, { abortEarly: false });
        // if (error) {
        //     const errors = error.details.map((err) => err.message);
        //     return res.status(400).json({
        //         message: errors,
        //     });
        // }

        let cartExist = await Cart.findOne({ userId: userId })
                                .populate("couponId")
                                .populate("userId")
                                .populate('products.productId')
                                .populate('products.sizeId')
                                .populate('products.toppings._id');
        if (!cartExist) {
            const newCart = await Cart.create({
                userId,
                products: [],
                total: 0,
            });
            cartExist = newCart;
        }

        const productExist = await Product.findById(productCartAdd.productId);
        if(!productExist){
            return res.status(400).json({
                message: 'Product không tồn tại',
            });
        }

        if(!productExist.isActive){
            return res.status(400).json({
                message: 'Product không hoạt động',
            });
        }

        const sizeExist = await Size.findById(productCartAdd.sizeId);
        if(!sizeExist){
            return res.status(400).json({
                message: 'Size không tồn tại',
            });
        }

        await addProductToCart(cartExist, productCartAdd);

        var cartDetail = await Cart.findOne({ userId: userId._id })                            
                                .populate("couponId")
                                .populate("userId")
                                .populate('products.productId')
                                .populate('products.sizeId')
                                .populate('products.toppings._id');
        if(!cartDetail){
            return res.status(200).json(cartDetail);
        }else{
            return res.status(404).json({message: "Khong tim thay cart"});
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Thêm vào giỏ hàng không thành công',
        });
    }
};


exports.getOne = async (req, res) => {

    try {
        const cart = await Cart.findOne({userId:req.user.id})
                        .populate("couponId")
                        .populate("userId")
                        .populate('products.productId')
                        .populate('products.sizeId')
                        .populate('products.toppings._id');
        if(!cart){
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng'
            })
        }

        if(cart.products.length <= 0){
            return res.status(400).json({
                message: 'Không có sản phẩm'
            }) 
        }
        await handleTotalCart(cart)
        await handleCouponTotal(cart)
        await cart.save();

        return res.status(200).json(cart)
    } catch (error) {
        console.log(error);
        return res.status(400).json({

            message : error.message
        })
    }
}

exports.changeQuantity = async (req, res) => {
    try {
        const idUser = req.user.id;
        const { idProduct = '' } = req.query;
        const { purchase_quantity, sizeId, toppingId } = req.body;

        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId: idUser })
            .populate("couponId")
            .populate("userId")
            .populate('products.productId')
            .populate('products.sizeId')
            .populate('products.toppings._id');

        if(!cart){
            return res.status(400).json({
                message: 'Giỏ hàng không tồn tại!', // Sản phẩm không tồn tại
                data: {}
            });
        }    

        // Duyệt qua các sản phẩm trong giỏ hàng
        cart.products.forEach((product, index) => {
            if (product.productId._id.toString() === idProduct.toString() && product.sizeId._id.toString() === sizeId) {
                
                if(!toppingId){
                    cart.products[index].purchase_quantity = purchase_quantity;
                }else{
                    product.toppings.forEach((toppingCart, index) =>{
                        if(String(toppingCart._id._id) == String(toppingId)){
                            if(purchase_quantity == 0){
                                product.toppings.splice(index, 1);  //xóa tại index, 1 là số ptu cần xóa
                            }
                            toppingCart._quantity = purchase_quantity
                        }
                    })
                }
            }
        });

        await handleTotalCart(cart)
        await handleCouponTotal(cart)
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
}

exports.removeProduct = async (req, res) => {
    try {
        const { idProduct = '', sizeId = '' } = req.query;
        const cart = await Cart.findOne({ userId: req.user.id });
        const productToRemove = cart.products.find((product) => String(product.productId) == String(idProduct) && String(product.sizeId) == String(sizeId));
        if (!productToRemove) {
            return res.status(404).json({
                message: 'Sản phẩm không tồn tại trong giỏ hàng!'
            });
        }

        // Filter out the product that matches the idProduct and sizeId
        const productsUpdated = cart.products.filter((product) => String(product.productId) !== idProduct || String(product.sizeId) !== sizeId);

        const cartUpdated = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { products: productsUpdated} },
            { new: true })
                .populate("couponId")
                .populate("userId")
                .populate('products.productId')
                .populate('products.sizeId')
                .populate('products.toppings._id');

        await handleTotalCart(cartUpdated)
        await handleCouponTotal(cartUpdated)
        await cartUpdated.save();

        return res.status(200).json(cartUpdated);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
}


// xoá tất cả
exports.clearUserCart = async (req, res) => {

    try {
        const userId = new mongoose.Types.ObjectId(req.user.id)
        const cartExist = await Cart.findOne({userId});
        if(!cartExist){
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng'
            })
        }
        cartExist.products= [];// xóa tất cả sản phẩm
        cartExist.total = 0; //đặt tổng tiền vê 0
        cartExist.couponId = null

        const cartUpdated = await Cart.findOneAndUpdate({ _id: cartExist._id }, cartExist, { new: true })
        await handleCouponTotal(cartExist)
        await cartExist.save();

        var cartPopulate = await Cart.findOne({ userId: userId }).populate("userId").populate("couponId");
        console.log(cartPopulate);
        return res.status(200).json(cartPopulate)
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'Xoá tất cả sản phẩm trong giỏ hàng không thành công'})
    }
}

// sử dụng hàm applyCouponToCart trong route handler
exports.applyCounpon = async(req,res)=>{
    try {
        const userId = req.user.id;
        const couponId = req.body.couponId

        const cart = await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng cho người dùng này'
            })
        }

        const coupon =await Coupon.findById(couponId);
        if(cart.total < coupon.min_purchase_amount){
            // cart.couponId = null
            await handleCouponTotal(cart)
            await cart.save();
            return res.status(400).json({
                message: 'Không đủ điều kiện để sử dụng phiếu giảm giá'
            })
        }
        if(!coupon){
            // cart.couponId = null
            await handleCouponTotal(cart)
            await cart.save();
            return res.status(400).json({
                message: 'Mã phiếu giảm giá không hợp lệ'
            })
        }
        //check người dùng đã sử dụng mã gảim giá chưa
        const currentDate = new Date();
        if(currentDate > coupon.expiration_date){
            cart.couponId = null
            await handleCouponTotal(cart)
            return res.status(400).json({ message: 'Mã phiếu giảm giá đã hết hạn' });
        }

        if(coupon.coupon_quantity <= 0){
            cart.couponId = null
            await handleCouponTotal(cart)
            await cart.save();
            return res.status(400).json({ message: 'Mã phiếu giảm giá hết số lư' });
        }
        
        // app dụng phiếu giảm giá vào giỏ hàng mà không tính rấ
        // nếu có rồi thì xóa
        if(cart.couponId && cart.couponId._id && cart.couponId._id.equals(coupon._id)){
            cart.couponId = null
        }else{
            cart.couponId = couponId
        }
        await handleCouponTotal(cart)
        await cart.save();

        var cartDetail = await Cart.findOne({ userId: userId })
                            .populate("couponId")
                            .populate("userId")
                            .populate('products.productId')
                            .populate('products.sizeId')
                            .populate('products.toppings._id');
        return res.status(200).json(cartDetail);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi áp dụng phiếu giảm giá' });
    }
}

// Sử dụng hàm removeCouponFromCart trong route handler để huỷ bỏ sử dụng mã phiếu giảm giá
exports.removeCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }
        if (cart.couponId == null) {
            return res.status(400).json({ message: 'Không sử dụng phiếu giảm giá' });
        }
        cart.couponId = null;
        await handleCouponTotal(cart)
        await cart.save();
        const cartPopulate = await Cart.findOne({ userId })
                                .populate("couponId")
                                .populate("userId")
                                .populate('products.productId')
                                .populate('products.sizeId')
                                .populate('products.toppings._id');

        return res.status(200).json(cartPopulate);
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi huỷ bỏ sử dụng phiếu giảm giá' });
    }
};

const handleTotalCart = async(cart) =>{
    var totalCart = 0
    if (cart && cart.products) {

        // tính size product
        cart.products.forEach((productCart) => {
          if (productCart && productCart.sizeId && productCart.productId.isActive) {
            totalCart += productCart.purchase_quantity * productCart.sizeId.size_price;

            // tính topping
            productCart.toppings.forEach((toppingCart) =>{
                if (toppingCart && toppingCart._id && toppingCart._id.isActive) {
                    totalCart += toppingCart._quantity * toppingCart._id.price;
                }
            })
          }
        });
      }
      cart.total = totalCart
}

// tính tiền nếu có mã giảm giá
const handleCouponTotal = async (cart) => {
    var totalCoupon = 0
    var coupond = await Coupon.findById(cart.couponId)
    if(coupond != null && cart.total >= coupond.min_purchase_amount){

        // nếu nhỏ hơn 100 thì tính %
        if( 0 < coupond.discount_amount && coupond.discount_amount <= 100){
            totalCoupon = (cart.total / 100) * coupond.discount_amount

        // còn lớn hơn 1k thì trừ thẳng
        }else if ( 0 < coupond.discount_amount && coupond.discount_amount > 1000) {
            totalCoupon = coupond.discount_amount
        }else{
            cart.couponId = null
        }
    }else{
        cart.couponId = null
    }
    cart.totalCoupon = totalCoupon
}

exports.applyCounponCartLocal = async(req,res)=>{
    try {
        const cart = req.body.cart;
        const couponId = req.body.data.couponId


        // Tìm giỏ hàng của người dùng
        if(!cart){
            return res.status(400).json({
                message: 'Giỏ hàng không tồn tại!', // Sản phẩm không tồn tại
                data: {}
            });
        }    

        const coupon =await Coupon.findById(couponId);
        if(cart.total < coupon.min_purchase_amount){
            // cart.couponId = null
            await handleCouponTotal(cart)
            return res.status(400).json({
                message: 'Không đủ điều kiện để sử dụng phiếu giảm giá'
            })
        }
        if(!coupon){
            // cart.couponId = null
            await handleCouponTotal(cart)
            return res.status(400).json({
                message: 'Mã phiếu giảm giá không hợp lệ'
            })
        }
        //check người dùng đã sử dụng mã gảim giá chưa
        const currentDate = new Date();
        if(currentDate > coupon.expiration_date){
            cart.couponId = null
            await handleCouponTotal(cart)
            return res.status(400).json({ message: 'Mã phiếu giảm giá đã hết hạn' });
        }

        if(coupon.coupon_quantity <= 0){
            cart.couponId = null
            await handleCouponTotal(cart)
            return res.status(400).json({ message: 'Mã phiếu giảm giá hết số lượng' });
        }
        
        // app dụng phiếu giảm giá vào giỏ hàng mà không tính rấ
        // nếu có rồi thì xóa
        if(cart.couponId && cart.couponId._id && cart.couponId._id == String(coupon._id)){
            cart.couponId = null
        }else{
            cart.couponId = coupon
        }
        await handleCouponTotal(cart)

        console.log(cart);
        return res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi áp dụng phiếu giảm giá' });
    }
}

exports.changeQuantityCartLocal = async (req, res) => {
    try {
        const { idProduct = '' } = req.query;
        const { purchase_quantity, sizeId, toppingId } = req.body.data;
        const cart = req.body.cart;

        // Tìm giỏ hàng của người dùng
        if(!cart){
            return res.status(400).json({
                message: 'Giỏ hàng không tồn tại!', // Sản phẩm không tồn tại
                data: {}
            });
        }    

        // Duyệt qua các sản phẩm trong giỏ hàng
        cart.products.forEach((product, index) => {
            if (product.productId._id.toString() === idProduct.toString() && product.sizeId._id.toString() === sizeId) {
                
                if(!toppingId){
                    cart.products[index].purchase_quantity = purchase_quantity;
                }else{
                    product.toppings.forEach((toppingCart, index) =>{
                        if(String(toppingCart._id._id) == String(toppingId)){
                            if(purchase_quantity == 0){
                                product.toppings.splice(index, 1);  //xóa tại index, 1 là số ptu cần xóa
                            }
                            toppingCart._quantity = purchase_quantity
                        }
                    })
                }
            }
        });

        await handleTotalCart(cart)
        await handleCouponTotal(cart)

        return res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
}


exports.updateCartLocal = async (req, res) => {
    try {
        const cart = req.body.cart;

        // Tìm giỏ hàng của người dùng
        if(!cart){
            return res.status(400).json({
                message: 'Giỏ hàng không tồn tại!', // Sản phẩm không tồn tại
                data: {}
            });
        }

        for (const productCart of cart.products) {
            productCart.productId = await Product.findById(productCart.productId._id);
            for(const toppingCart of productCart.toppings){
                toppingCart._id = await Topping.findById(toppingCart._id._id);
            }
        }
        
        await handleTotalCart(cart)
        await handleCouponTotal(cart)
        console.log(cart);
        return res.status(200).json(cart);

    }catch(err){
        console.log(err);
        return res.status(400).json({
            message: err.message
        });
    }    
}
