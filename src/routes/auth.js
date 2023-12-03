var express = require('express');
var authController = require('../controllers/auth');
const UserOTPVerification = require('../models/UserOTPVerification');
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

var router = express.Router();
const multer = require('multer');
const ab = multer();
router.get("/getCurrentUser",authenticate,authController.getCurrentUser)
router.get("/users",authController.getAll)
router.get("/shipper",authController.getAllShipper)

router.get("/users/:id",authenticate,authController.getOneById)
router.delete("/users/:id",authenticate,authorization,authController.removeByAdmin)
router.patch("/users",authenticate, authController.updateUser)
router.patch("/users/uploadAvatar",authenticate, upload.array("images", 1), authController.uploadAvatarUser)
router.patch("/users/updateAvatar/:publicId",authenticate, upload.array("images", 1), authController.updateAvatarUser)
router.post("/signup",authController.signup)
router.post("/singupShipper",ab.none(),authController.signupShipper)

router.post('/signin', authController.signin)
router.post('/signinWithGG', authController.signinWithGG)
router.post('/signinWithFb', authController.signinWithFb)
router.post('/signinDeliveryApp', authController.signinShipper);
router.post("/logout", authenticate, authController.logout)


router.post("/refresh", authController.refreshToken)
router.post("/verifyOTP", authController.verifyOTP)
router.post("/resendOTPVerificationCode", authController.sendNewOtp)
router.get("/forgotPassword", authController.forgotPassword)
router.post("/verifyOTPChangePassword", authController.verifyOTPChangePassword)
router.post("/resetPassword", authController.resetPassword)
router.get("/users/search/:text", authenticate, authController.searchAuth)
router.post("/changePassword", authenticate, authController.changePassword)
router.get('/admin/users', authController.getUserUI);
router.get('/admin/users/:id', authController.getUserByIdUI);
router.get('/userbyadmin/:id', authController.getUserByAdmin);
router.get('/deletebyadmin/:id', authController.removeByAdmin);
router.post('/login',authController.loginAdmin)
router.get("/admin/shipper/create", authController.getShipperCreateUI);
router.get("/admin/shipper", authController.getShipperDataUI);
router.get("/admin/shipper/top", authController.getShipperTop);



router.post('/update/tokendevice',authenticate, authController.updateToken)
router.post("/logout/mobile", authenticate, authController.logoutMobile)

module.exports = router;
