var Cart = require("../models/cart")
var Auth = require("../models/auth")
var mongoose = require("mongoose")
var Coupon = require("../models/coupons")
// var order = require("../models/order")
var cartSchema = require("../schemas/cart").cartSchema
var Product = require("../models/product")
var Size = require("../models/size")


const ressetCart = async (idUser) =>{
    try {
        const cartExist = await Cart.findOne({userId:idUser})
        const productsUpdated = []
        cartExist.products = productsUpdated
        const cartUpdated = await Cart.findByIdAndUpdate({_id: cartExist._id}, cartExist,{new :true})
     return cartUpdated

    } catch (error) {
         console.log(error.message)
        return {}
    }
}


const addProductToCart = async (cartExist, productToAdd) => {
    try {
        const productExistIndex = cartExist.products.findIndex((product) =>
            product.productId === productToAdd.productId &&
            product.sizeId === productToAdd.sizeId
        );

        if (productExistIndex !== -1) {
            const size = await Size.findById(productToAdd.sizeId);
            const updatedProductPrice = productToAdd.product_price + size.size_price;
            const existingProduct = cartExist.products[productExistIndex];
            existingProduct.purchase_quantity += productToAdd.purchase_quantity;
            existingProduct.product_price = updatedProductPrice;


        } else {
            const size = await Size.findById(productToAdd.sizeId);
            const  name_size = size.size_name
            const newProduct = {
                productId: productToAdd.productId,
                product_name: productToAdd.product_name,
                product_price: productToAdd.product_price + size.size_price,
                image: productToAdd.image,
                purchase_quantity: productToAdd.purchase_quantity,
                sizeId: productToAdd.sizeId,
                 sizeName: name_size,
            };
         console.log(name_size);
            cartExist.products.push(newProduct);
        }

     
        // Tính toán lại tổng giá trị của giỏ hàng sau khi thêm/sửa sản phẩm
        cartExist.total = cartExist.products.reduce((total, item) => total + item.purchase_quantity * item.product_price, 0);

        

        // Lưu giỏ hàng sau khi cập nhật (không có phiếu giảm giá)
        const cartUpdated = await cartExist.save();
// Kiểm tra xem phiếu giảm giá đã được áp dụng
if (cartExist.couponId !== null) {
    // Tính lại tổng tiền bằng cách cộng với giá của sản phẩm mới
    cartExist.products = cartExist.products.map((item) => {
        return {
            ...item,
            product_price: item.purchase_quantity, // Khôi phục giá của sản phẩm về giá ban đầu
        };
    });
    cartExist.total = cartExist.products.reduce((total, item) => total + item.product_price * item.purchase_quantity, 0);
    cartExist.couponId = null;

    // Xóa giá ban đầu của sản phẩm
    cartExist.products.forEach((item) => {
        item.purchase_quantity = undefined;
    });
}
        return cartUpdated;
    } catch (error) {
        throw error;
    }
};

exports.createCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const productNeedToAdd = req.body;
        const userExist = await Auth.findById(userId);

        if (!userExist) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại!',
            });
        }

        const { error } = cartSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }

        let cartExist = await Cart.findOne({ userId: userId });

        if (!cartExist) {
            const newCart = await Cart.create({
                userId,
                products: [],
                total: 0,
            });
            cartExist = newCart;
        }

        await addProductToCart(cartExist, productNeedToAdd);

        return res.status(200).json(
            cartExist
        );
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: 'Thêm vào giỏ hàng không thành công',
        });
    }
};


exports.getOne = async (req, res) => {

    try {
        const cart = await Cart.findOne({userId:req.params.id})
        if(!cart){
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng',
                data:[]
            })
        }
        return res.status(200).json(
             cart
        )
    } catch (error) {
        return res.status(400).json({

            message : error.message
        })
    }
}

exports.changeQuantity = async (req, res) => {
    try {
        const idUser = req.params.id;
        const { idProduct = '' } = req.query;
        const { purchase_quantity, sizeId } = req.body;
        console.log("idSize: " + sizeId);
        console.log("user id: " + idUser);
        console.log("idProduct: " + idProduct);

        // Kiểm tra xem người dùng có tồn tại không
        const userExist = await Auth.findOne({ _id: idUser });

        if (!userExist) {
            return res.status(404).json({
                message: 'Vui lòng đăng nhập!' // Vui lòng đăng nhập
            });
        }

        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId: idUser });

        // Khởi tạo biến để theo dõi sự tồn tại của sản phẩm
        let productExists = false;
        // Duyệt qua các sản phẩm trong giỏ hàng
        cart.products.forEach((product, index) => {
            if (product.productId.toString() === idProduct.toString() && product.sizeId.toString() === sizeId) {
                productExists = product;
                cart.products[index].purchase_quantity = purchase_quantity;
            }
        });

        if (productExists) {
            // Tính toán tổng chi phí cập nhật của các món hàng trong giỏ
            const totalUpdated = cart.products.reduce((total, product) => {
                return (total += product.purchase_quantity * product.product_price);
            }, 0);

            // Cập nhật giỏ hàng với thông tin sản phẩm đã được sửa đổi và tổng chi phí
            const cartUpdated = await Cart.findOneAndUpdate(
                { userId: idUser },
                { $set: { products: cart.products, total: totalUpdated } },
                { new: true }
            );

            return res.status(200).json({
                message: 'Thay đổi sản phẩm thành công', // Số lượng sản phẩm đã được thay đổi thành công
                data: cartUpdated
            });
        }

        return res.status(400).json({
            message: 'Sản phẩm không tồn tại!', // Sản phẩm không tồn tại
            data: {}
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

exports.removeProduct = async (req, res) => {
    try {
        const idUser = req.params.id;
        const { idProduct = '', sizeId = '' } = req.query;
        const userExist = await Auth.findOne({ _id: idUser });

        if (!userExist) {
            return res.status(404).json({
                message: 'Vui lòng đăng nhập!'
            });
        }

        const cart = await Cart.findOne({ userId: idUser });

        // Check if the product with the specified idProduct and sizeId exists in the cart
        const productToRemove = cart.products.find((product) => product.productId === idProduct && product.sizeId === sizeId);

        if (!productToRemove) {
            return res.status(404).json({
                message: 'Sản phẩm không tồn tại trong giỏ hàng!'
            });
        }

        // Filter out the product that matches the idProduct and sizeId
        const productsUpdated = cart.products.filter((product) => product.productId !== idProduct || product.sizeId !== sizeId);

        const totalUpdated = productsUpdated.reduce((total, product) => {
            return (total += product.purchase_quantity * product.product_price);
        }, 0);

        const cartUpdated = await Cart.findOneAndUpdate(
            { userId: idUser },
            { $set: { products: productsUpdated, total: totalUpdated } },
            { new: true }
        );

        return res.status(200).json(cartUpdated);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}


// xoá sản phẩm ra khỏi giở hàng
exports.clearUserCart = async (req, res) => {

    try {
        const userId = new mongoose.Types.ObjectId(req.params.id)
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

        return res.status(200).json(
             cartUpdated
        )
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Xoá tất cả sản phẩm trong giỏ hàng không thành công'
        })
    }
}
//áp dụng mã giảm giá
const applyCouponToCart = async(userId, couponId) =>{
    try {
        const cart = await Cart.findOne({userId});
        const coupon = await Coupon.findById(couponId);
        if(coupon.discount_amount){
             // Lưu trữ giá ban đầu của từng sản phẩm trong giỏ hàng
            cart.products = cart.products.map((item) => {

                return{
                    ...item,
                    originalPrice : item.product_price,// Lưu giá ban đầu của sản phẩm
                }
            });
              // áp dụng mã để trừ
            cart.products = cart.products.map((item) => {
                const originalItemPrice = item.product_price;
                const discountAmount = (coupon.discount_amount / 100) * originalItemPrice;
                const discountedPrice = originalItemPrice - discountAmount;

                return{
                    ...item,
                    product_price: discountedPrice
                }
            });
            cart.total = cart.products.reduce((total,item) =>total + item.product_price * item.purchase_quantity, 0);
           // đánh dấu giỏ hàng đã áp dụng phiếu giảm giá
            cart.couponId = coupon._id;
  // Lưu giỏ hàng sau khi cập nhật
  const updatedCart = await cart.save();

  return updatedCart;

        }

    } catch (error) {
         throw error;
    }
}

// sử dụng hàm applyCouponToCart trong route handler
exports.applyCounpon = async(req,res)=>{
    try {
        const userId = req.params.id;
        const couponId = req.body.couponId

        const cart = await Cart.findOne({userId});

        if(!cart){
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng cho người dùng này'
            })
        }
        if(cart.couponId !=null){
            return res.status(400).json({
                message: 'Chỉ được sử dụng 1 phiếu giảm giá'
            })
        }
        const coupon =await Coupon.findById(couponId);
        if(cart.total < coupon.min_purchase_amount){
            return res.status(400).json({
                message: 'Không đủ điều kiện để sử dụng phiếu giảm giá'
            })
        }
        if(!coupon){
            return res.status(400).json({
                message: 'Mã phiếu giảm giá không hợp lệ'
            })
        }
        //check người dùng đã sử dụng mã gảim giá chưa
        const currentDate = new Date();
        if(currentDate> coupon.expiration_date){
            return res.status(400).json({ message: 'Mã phiếu giảm giá đã hết hạn' });
        }
             // Áp dụng mã phiếu giảm giá vào giỏ hàng bằng cách gọi hàm applyCouponToCart
        const updatedCart = await applyCouponToCart(userId, couponId);

        return res.json(

             updatedCart,
        );
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi áp dụng phiếu giảm giá' });
    }
}

// Hủy bỏ sử dụng mã phiếu giảm giá
const removeCouponFromCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId });
        // Kiểm tra xem có mã phiếu giảm giá đã được áp dụng không
        if (cart.couponId) {
            // Khôi phục giá của từng sản phẩm từ giá ban đầu
            cart.products = cart.products.map((item) => {
                return {
                    ...item,
                    product_price: item.originalPrice, // Khôi phục giá của sản phẩm về giá ban đầu
                };
            });

            // Đặt couponId về null để đánh dấu là không sử dụng mã phiếu giảm giá
            cart.couponId = null;

            // Tính toán lại tổng giá trị của giỏ hàng sau khi khôi phục giá sản phẩm
            cart.total = cart.products.reduce((total, item) => total + item.product_price * item.purchase_quantity, 0);

            // Xóa giá ban đầu của sản phẩm
            cart.products.forEach((item) => {
                item.originalPrice = undefined
            });
            // Lưu giỏ hàng sau khi cập nhật
            const updatedCart = await cart.save();

            return updatedCart;
        }

        return cart;
    } catch (error) {
        throw error;
    }
};


// Sử dụng hàm removeCouponFromCart trong route handler để huỷ bỏ sử dụng mã phiếu giảm giá
exports.removeCoupon = async (req, res) => {
    try {
        const userId = req.params.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }
        if (cart.couponId == null) {
            return res.status(400).json({ message: 'Không sử dụng phiếu giảm giá' });
        }
        const updatedCart = await removeCouponFromCart(userId);
        return res.json({
            message: 'Huỷ bỏ sử dụng phiếu giảm giá thành công',
            data: updatedCart,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi huỷ bỏ sử dụng phiếu giảm giá' });
    }
};