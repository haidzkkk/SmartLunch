var express = require('express');

var applyCoupon , changeQuantity, clearUserCart, create, getOne, removeCoupon, removeProduct =  require ('../controllers/cart');

var router = express.Router();

cartRouter.get("/carts/:id", getOne);
cartRouter.post("/carts/:id/create", create);
cartRouter.delete("/carts/:id/remove", removeProduct);
cartRouter.delete("/carts/:id/clears", clearUserCart);
cartRouter.put("/carts/:id/change", changeQuantity);
cartRouter.patch("/carts/:id/apply", applyCoupon);
cartRouter.patch("/carts/:id/remove-coupon", removeCoupon);
module.exports = router;
