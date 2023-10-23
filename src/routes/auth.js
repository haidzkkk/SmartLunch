var express = require('express');
var authController = require('../controllers/auth');
const UserOTPVerification = require('../models/UserOTPVerification');
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

var router = express.Router();

router.get("/getCurrentUser",authenticate,authController.getCurrentUser)
router.get("/users",authController.getAll)
router.get("/users/:id",authenticate,authController.getOneById)
router.delete("/users/:id",authenticate,authorization,authController.removeByAdmin)
router.patch("/users",authenticate, authController.updateUser)
router.patch("/users/uploadAvatar",authenticate, upload.array("images", 1), authController.uploadAvatarUser)
router.patch("/users/updateAvatar/:publicId",authenticate, upload.array("images", 1), authController.updateAvatarUser)
router.post("/signup",authController.signup)
router.post('/signin', authController.signin)
router.post("/logout",authenticate,authController.logout)
router.post("/refresh", authController.refreshToken)
router.post("/verifyOTP", authController.verifyOTP)
router.post("/resendOTPVerificationCode", authController.sendNewOtp)
router.get("/forgotPassword", authController.forgotPassword)
router.post("/verifyOTPChangePassword", authController.verifyOTPChangePassword)
router.post("/resetPassword", authController.resetPassword)
router.post("/changePassword", authenticate,authController.changePassword)
module.exports = router;
