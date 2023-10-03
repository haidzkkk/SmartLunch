var express = require('express');

var cartController =  require ('../controllers/cart');

var router = express.Router();

// cartRouter.get("/carts/:id", cartController.getOne);
// cartRouter.post("/carts/:id/create", cartController.creatCart);
// cartRouter.delete("/carts/:id/remove", cartController.removeProduct);
// cartRouter.delete("/carts/:id/clears", cartController.clearUserCart);
// cartRouter.put("/carts/:id/change", cartController.changeQuantity);
// cartRouter.patch("/carts/:id/apply", cartController.applyCoupon);
// cartRouter.patch("/carts/:id/remove-coupon", cartController.removeCoupon);
module.exports = router;
