var express = require('express');
var authController = require('../controllers/auth');
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get("/users",authController.getAll)
router.get("/users/:id",authController.getOneById)
router.delete("/users/:id",authenticate,authorization,authController.removeByAdmin)
routerAuth.patch("/user/:id/admin", authenticate, authorization, updateUserByAdmin);
router.post("/signup",authController.signup)
router.post('/signin', authController.signin)
router.post("/logout",authenticate,authController.logout)
router.post("/refresh", authController.refreshToken)
router.post("/verifyOTP", authController.verifyOTP)
router.post("/resendOTPVerificationCode", authController.sendNewOtp)

module.exports = router;
