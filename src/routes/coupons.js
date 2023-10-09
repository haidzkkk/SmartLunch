var express = require('express')
var  couponController = require('../controllers/coupons.js')

var router = express.Router();

router.post("/coupons", couponController.createCoupons);
router.get("/coupons", couponController.getAllCoupons);
router.get("/coupons/:id", couponController.getOneCoupons);
router.delete("/coupons/:id", couponController.removeCoupons);
router.patch("/coupons/:id", couponController.updateCoupons);


module.exports = router;