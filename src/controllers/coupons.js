var Coupon = require("../models/coupons.js")
var CouponSchema = require("../schemas/coupons.js")
var { uploadImage, updateImage } = require('../controllers/upload');
const fetch = require('node-fetch');

exports.getCouponUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/coupons');
    const data = await response.json();
    console.log(data);
    res.render('coupon/coupon', { data ,layout :"Layouts/home"});
};

exports.getAddCouponUI = async (req, res) => {
 
    res.render('coupon/addCoupon', {  layout :"Layouts/home"});
};
exports.getCouponIdUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/coupons/' + req.params.id);
    const data = await response.json();
    res.render('coupon/detail', { data ,layout :"Layouts/home"});
};


exports.createCoupons = async (req, res) => {
  try {
      const body = req.body;
      const files = req.files;

      // Validate discount_amount, coupon_quantity, and min_purchase_amount
      if (body.discount_amount < 0 || body.coupon_quantity < 0 || body.min_purchase_amount < 0) {
        // Redirect to the error page
        return res.status(400).redirect('error.html');
      }

      // Check if the coupon name is already used
      const existingCoupon = await Coupon.findOne({ name: body.coupon_name });
      if (existingCoupon) {
          return res.status(400).json({
              message: "Tên mã khuyến mãi đã tồn tại, vui lòng chọn tên khác.",
          });
      }

      console.log("Received form data:", body);

      // Upload images and handle the response
      var images = await uploadImage(files);
      if (images[0] == null) {
          return res.status(400).json({
              message: "Thêm sản phẩm thất bại, chưa có ảnh tải lên",
          });
      }
      body.coupon_images = images;

      console.log("Received form data:", images);

      // Create a new coupon in the database
      const createdCoupon = await Coupon.create(body);

      if (!createdCoupon) {
          return res.status(400).json({
              message: "Failed to create the coupon.",
          });
      }

      res.status(303).set('Location', '/api/admin/coupons').send();
  } catch (error) {
      console.error("Error creating coupon:", error);
      return res.status(500).json({
          message: "Internal server error.",
      });
  }
};



exports.updateCoupon = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      var files = req.files 
  
      const { error } = CouponSchema.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          message: errors,
        });
      }
      var images = await updateImage(files)
      body.category_image = images
  
      const category = await Coupon.findOneAndUpdate({ _id: id }, body, {
        new: true,
      });
      if (!category || category.length === 0) {
        return res.status(400).json({
          message: "Cập nhật danh mục thất bại",
        });
      }
      res.status(303).set('Location', '/api/admin/coupons').send();
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
  
exports.getOneCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        return res.status(200).json(
            coupon
        )
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
}


exports.getAllCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        if (!coupon) {
            return res.status(404).json({
                message: "Lấy tất cả phiếu giảm giá thất bại"
            })
        }

        return res.status(200).json(
       coupon
           
        )
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
  

exports.removeCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        res.status(303).set('Location', '/api/admin/coupons').send();
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.updateCoupons = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true })
        res.status(303).set('Location', '/api/admin/coupons').send();
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.removeAll = async (req, res) => {
    try {
      // Use deleteMany to remove all documents in the Coupon collection
      await Coupon.deleteMany({});
    
      res.status(303).set('Location', '/api/admin/coupon').send();
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };