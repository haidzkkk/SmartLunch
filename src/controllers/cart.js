var Cart = require("../models/cart")
var Auth = require("../models/auth")
var mongoose = require("mongoose")
// var Coupon = require("../models/coupons")
// var order = require("../models/order")
var cartSchema = require("../schemas/cart")
var Product = require("../models/product")
var Size = require("../models/size")

exports.ressetCart = async (idUser) =>{
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
//cartExist giỏ hàng hiện có 
//productAdd sản phẩm muốn thêm

exports.addProduct = async (cartExist, productAdd, res) =>{
    try {
//Đầu tiên, nó kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng (productExist). 
//Nếu sản phẩm đã tồn tại, nó sẽ cập nhật thông tin về số lượng (stock_quantity) và 
//giá (product_price) của sản phẩm đó trong giỏ hàng.
        const productExist = cartExist.products.find((product) =>
        product.productId === productAdd.productId &&
        product.colorId === productAdd.colorId &&
        product.sizeId === productAdd.sizeId
        );
        console.log(productExist)
//  Nếu sản phẩm chưa tồn tại trong giỏ hàng,
// nó tạo một sản phẩm mới (newProduct) 
//và thêm vào danh sách sản phẩm của giỏ hàng.
        if(productExist){
            const size = await Size.findById(productAdd.sizeId);
            const updateProductPrice =  productAdd.product_price +size.size_price;
            productExist.stock_quantity += productAdd.stock_quantity
            productExist.product_price = updateProductPrice
            cartExist.total += productAdd.stock_quantity * updateProductPrice;
        }else{
//chọn size sản phẩm
            const size = await Size.findById(productAdd.sizeId)
            const newProduct = {
                productId: productAdd.productId,
                product_name: productAdd.product_name,
                product_price: productAdd.product_price + size.size_price,
                image: productAdd.image,
                stock_quantity: productAdd.stock_quantity,
                sizeId: productAdd.sizeId,
                colorId: productAdd.colorId
            }
            cartExist.products.push(newProduct);
            cartExist.total += productAdd.stock_quantity * newProduct.product_price;

        }
        // Sau khi thêm hoặc cập nhật sản phẩm, nó kiểm tra xem sản phẩm đó có đủ số lượng trong kho không.
        // Nếu sản phẩm không tồn tại hoặc số lượng trong giỏ hàng vượt quá số lượng tồn kho, nó sẽ trả về một lỗi 400.
        for(const item of cartExist.products){
            const product = await Product.findById(item.productId);
           
            if(!product||item.stock_quantity > product.stock_quantity){
                return res.status(400).json({ message: `Đã quá số hàng tồn` });
        }
    }
    //     //Tiếp theo, nếu giỏ hàng có một phiếu giảm giá (couponId không phải là null), 
        //nó sẽ khôi phục giá của sản phẩm về giá ban đầu (lấy từ originalPrice) và tính lại tổng tiền của giỏ hàng.
    // Kiểm tra xem phiếu giảm giá đã được áp dụng
    if(cartExist.couponId != null){
        cartExist.product = cartExist.product.map((item)=>{

        return {
            ...item,
            product_price : item.originalPrice,
        };
    
    });
    cartExist.total = cartExist.products.reduce((total, item) => total + item.product_price * item.stock_quantity, 0);
    cartExist.couponId = null
            // Xóa giá ban đầu của sản phẩm
            cartExist.products.forEach((item) => {
                item.originalPrice = undefined
            });
        }

        // Lưu giỏ hàng sau khi cập nhật (không có phiếu giảm giá)
        const cartUpdated = await Cart.findOneAndUpdate({ _id: cartExist._id }, cartExist, { new: true })
        return res.status(200).json({
            message: 'Thêm vào giỏ hàng thành công',
            data: cartUpdated
        });

} catch (error) {
    console.log(error.message);
    return res.status(400).json({
        message: 'Thêm vào giỏ hàng không thành công'
    });
    }

}
exports.creatCart = async (req , res , next) => {

    try {

        //kiểm tra sự tồn tại của ngươid dùng
        const userId = req.params.id
        const productNeedToAdd = req.body
        const userExist = await Auth.findById({userId}  )
          
        if(!userExist){
            return res.status(400).json({
                message: 'Không tìm thấy tài khoản'
            })
        }
        const error = cartSchema.validate(req.body,{abortEarly: false})
        if(error){
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })

        }
        // kiểm tra sản phẩm có trong giỏ hàng chưa
        const cartExist = await Cart.findOne({userId:userId})
        if(cartExist){
            return this.addProduct(cartExist,productNeedToAdd,res)
        }
        const newCart = new Cart.create({
            userId,
            products:[
                {
                    productId: productNeedToAdd._id,
                    ...productNeedToAdd
                }
              
            ],
            //tiền trong giỏ hnagf cũng phải thay đổi
            total: productNeedToAdd.product_price *productNeedToAdd.stock_quantity
          
        })
      if(!newCart){
        return res.status(400).json({
            message: 'Thêm vào giỏ hàng không thành công'
        })
      }
      return res.status(200).json({
        message: 'Thêm vào giỏ hàng thành công',
        data: newCart
      })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.getOne = async (req, res) => {

    try {
        const cart = await Cart.findOne({userId:req.params.id})
        if(!cart){
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng',
                data:[]
            })
        }
        return res.status(200).json({
            message: 'Lấy thông tin giỏ hàng thành công',
            data: cart
        })
    } catch (error) {
        return res.status(400).json({

            message : error.message
        })
    }
}
exports.changeQuantity = async (req, res) => {

    try {
        const idUser = req.params.id
        const {isProduct = ""} = req.query
        const {stock_quantity = ""} = req.body
        const userExist= await Auth.findOne({_id : idUser})
        if(!userExist) {
            return res.status(400).json({
                message: 'vui lòng đăng nhập !'
            })
        }
        const cart = await Cart.findOne({userId :idUser})
        const productExt = cart.products.find((product) => product.productId === idProduct)
        if(!productExt){
            productExt.stock_quantity = stock_quantity
            const productsUpdated = [...cart.products.filter((product) => product.productId !== idProduct), productExt]
            const totalUpdated = productsUpdated.reduce((total, product) => {
                return (total += product.stock_quantity * product.product_price)
        },0)
        const cartUpdated = await Cart.findOneAndUpdate(
            { userId: idUser },
            { $set: { products: productsUpdated, total: totalUpdated } },
            { new: true }
        )
        return res.status(200).json({
            message: 'Thay đổi sản phẩm thành công',
            data: cartUpdated
        })
    }
    return res.status(400).json({
        message: 'Sản phẩm không tồn tại!',
        data: {}
    })
   } catch (error) {
      return res.status(400).json({
            messge: error.message
        })
    }
}
exports.removeProduct = async (req , res) =>{
    try {
        const idUser = req.params.id
        const {idProduct= ''} = req.body
        const userExist = await Auth.findOne({_id: idUser})
            if(!userExist) {
                return res.status(404).json({
                    message: 'vui lòng đăng nhập!'
                })
            }
            const cart = await Cart.findOne({userId:idUser})
            const productsUpdated = cart.products.find((product) => product.productId !== idProduct)
            const totalUpdated = productsUpdated.reduce((total,product)=>{
                return (total += product.stock_quantity * product.product_price)
            }, 0)

            const cartUpdate = await Cart.findOneAndUpdate(
                { userId: idUser },
                { $set: { products: productsUpdated, total: totalUpdated } },
                { new: true }
            )
            return res.status(200).json({

                message:"xoa san pham thanh cong"
            })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
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

        return res.status(200).json({
            message: 'Xóa giỏ hàng thành công',
            data: cartUpdated
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Xoá tất cả sản phẩm trong giỏ hàng không thành công'
        })
    }
}
//áp dụng mã giảm giá
exports.applyCouponToCart = async(userId, couponId) =>{
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
            cart.total = cart.products.reduce((total,item) =>total + item.product_price * item.stock_quantity, 0);
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

        return res.json({
            message: 'Áp dụng phiếu giảm giá thành công',
            data: updatedCart,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi áp dụng phiếu giảm giá' });
    }
}

// Hủy bỏ sử dụng mã phiếu giảm giá
exports.removeCouponFromCart = async (userId) => {
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
            cart.total = cart.products.reduce((total, item) => total + item.product_price * item.stock_quantity, 0);

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