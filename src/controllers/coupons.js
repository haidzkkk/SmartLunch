var Coupon = require("../models/coupons.js")
var CouponSchema = require("../schemas/coupons.js")


exports.createCoupons = async (req, res) => {
    try{
        var coupon = req.body;
        await Coupon.create(coupon);
        res.status(200).json(coupon);
    }catch(err){
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.getOneCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        return res.status(200).json(
            coupon
        )
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.getAllCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.find();
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
        return res.status(200).json(
            coupon
        )
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
        return res.status(200).json(coupon
        )
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}