var express = require("express")
var toppingController = require("../controllers/topping.js")
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;

var router = express.Router();

router.get("/topping", toppingController.getTopping);
router.get("/topping/:id", toppingController.getToppingById);
router.get("/topping/product/:id", toppingController.getToppingByProductId);
router.post("/topping", authenticate, toppingController.createTopping);
router.put("/topping/:id", authenticate, authorization, toppingController.updateTopping);
router.delete("/topping/delete/:id", authenticate, authorization, toppingController.removeTopping);

router.patch("/topping/active/:id", authenticate, toppingController.toggleActive);
// router.get("/admin/topping", authenticate, toppingController.getLayout);
// router.get("/admin/getToppingCreate", toppingController.getToppingCreateUI);

// router.get('/admin/topping', sizeController.getSizeUI );
// router.get('/admin/topping/:id', sizeController.getSizeByIdUI);

module.exports = router;