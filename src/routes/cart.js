var express = require('express');
var cartController =  require ('../controllers/cart');
var { authenticate } = require('../middlewares/authenticate')

var cartRouter = express.Router();

cartRouter.get("/carts", authenticate , cartController.getOne);
cartRouter.post("/carts/create", authenticate, cartController.createCart);
cartRouter.delete("/carts/remove", authenticate, cartController.removeProduct);
cartRouter.delete("/carts/clears", authenticate, cartController.clearUserCart);
cartRouter.put("/carts/change", authenticate, cartController.changeQuantity);
cartRouter.patch("/carts/apply", authenticate, cartController.applyCounpon);
cartRouter.patch("/carts/remove-coupon", authenticate, cartController.removeCoupon);
module.exports = cartRouter;
