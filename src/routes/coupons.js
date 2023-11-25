var express = require('express')
var  couponController = require('../controllers/coupons.js')
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require("../config/configApp").upload;
var router = express.Router();


router.post("/createCoupon", upload.array("images", 1),couponController.createCoupons);
router.get("/coupons",couponController.getAllCoupons);
router.get("/coupons/:id",couponController.getOneCoupons);
router.get("/delete/coupons/:id",authenticate, couponController.removeCoupons);
router.post("/coupons/:id",authenticate,couponController.updateCoupons);

router.get('/admin/coupons',authenticate, couponController.getCouponUI);
router.get('/admin/coupons/:id',authenticate, couponController.getCouponIdUI);
router.get('/admin/addCoupon',authenticate, couponController.getAddCouponUI);


module.exports = router;