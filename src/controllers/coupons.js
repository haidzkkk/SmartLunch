var Coupon = require("../models/coupons.js")
var CouponSchema = require("../schemas/coupons.js")

exports.getCouponUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/coupons');
    const data = await response.json();
    res.render('coupon/coupon', { data });
  };
  exports.getCouponIdUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/coupons/'+req.params.id);
    const data = await response.json();
    res.render('coupon/detail', { data});
  };


exports.createCoupons = async (req, res) => {
    try{
        var coupon = req.body;
        await Coupon.create(coupon);
        res.status(303).set('Location', '/api/admin/coupons').send();
    }catch(error){
        return res.status(400).json({
            message: error,
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
            message: error,
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