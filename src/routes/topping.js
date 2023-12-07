var express = require("express")
var toppingController = require("../controllers/topping.js")
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;

var router = express.Router();

router.get("/topping", authenticate, authorization, toppingController.getTopping);
router.get("/topping/:id", toppingController.getToppingById);
router.get("/topping/product/:id", toppingController.getToppingByProductId);
router.post("/topping", authenticate, authorization, toppingController.createTopping);
router.put("/topping/:id", authenticate, authorization, toppingController.updateTopping);
router.delete("/topping/delete/:id", authenticate, authorization, toppingController.removeTopping);

router.patch("/topping/active/:id", authenticate, authorization, toppingController.toggleActive);

// router.get('/admin/topping', sizeController.getSizeUI );
// router.get('/admin/topping/:id', sizeController.getSizeByIdUI);

module.exports = router;