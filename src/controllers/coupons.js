var Coupon = ("../models/coupons.js")
var CouponSchema = ("../schemas/coupons.js")


exports.createCoupons = async (req, res) => {
    try {
        const formDataCoupon = req.body
        const { error } = CouponSchema.validate(formDataCoupon, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const coupon = await Coupon.create(formDataCoupon)
        if (!coupon) {
            return res.status(404).json({
                error: "Tạo phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Tạo phiếu giảm giá thành công",
            coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.getOneCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                message: "Lấy 1 phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy 1 phiếu giảm giá thành công",
            coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
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
        return res.status(200).json({
            message: "Lấy tất cả phiếu giảm giá thành công",
            coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.removeCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                message: "Xóa phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Xóa phiếu giảm giá thành công!",
            coupon
        })
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
        const { error } = CouponSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true })
        if (!coupon) {
            return res.status(404).json({
                message: "Cập nhật phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật phiếu giảm giá thành công",
            updateCouponsSuccess: coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}