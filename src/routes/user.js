const express = require('express');
const userController = require('../controllers/user.js');
const authenticate = require('../middlewares/authenticate.js').authenticate;

const routerUser = express.Router();
routerUser.patch("/users",authenticate,userController.updateUser)
routerUser.post('/forgotpassword', userController.forgotPassword)
routerUser.patch('/resetpassword/:token', userController.resetPassword)
routerUser.patch('/changepassword', authenticate, userController.changePassword)

module.exports = routerUser;