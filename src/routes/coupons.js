var express = require('express')
var  couponController = require('../controllers/coupons.js')

var router = express.Router();

router.post("/coupons", couponController.createCoupons);
router.get("/coupons", couponController.getAllCoupons);
router.get("/coupons/:id", couponController.getOneCoupons);
router.get("/delete/coupons/:id", couponController.removeCoupons);
router.post("/coupons/:id", couponController.updateCoupons);
router.get('/admin/coupons', couponController.getCouponUI);
router.get('/admin/coupons/:id', couponController.getCouponIdUI);

module.exports = router;