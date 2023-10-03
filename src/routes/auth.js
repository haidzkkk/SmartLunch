var express = require('express');
var authController = require('../controllers/auth');
const UserOTPVerification = require('../models/UserOTPVerification');
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get("/users",authController.getAll)
router.get("/users/:id",authController.getOneById)
router.delete("/users/:id",authenticate,authorization,authController.removeByAdmin)
router.patch("/users",authenticate,authController.updateUser)
router.post("/signup",authController.signup)
router.post('/signin', authController.signin)
router.post("/logout",authenticate,authController.logout)
router.post("/refresh", authController.refreshToken)
router.post("/verifyOTP", authController.verifyOTP)
router.post("/resendOTPVerificationCode", authController.sendNewOtp)
module.exports = router;
