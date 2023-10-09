var express = require('express');
var productController = require('../controllers/products')
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;

var router = express.Router();

router.get("/products", productController.getAll);
router.get("/products/delete",productController.getAllDelete);
router.get("/products/:id", productController.get);
router.delete("/products/:id", authenticate, authorization, productController.remove);
router.delete("/products/force/:id", authenticate, authorization, productController.removeForce);
router.post("/products", authenticate, authorization, productController.addProduct);
router.patch("/products/:id", authenticate, authorization, productController.updateProduct);
router.patch("/products/restore/:id", authenticate, authorization, productController.restoreProduct);
router.get("/products/views/:id", productController.viewProduct);



module.exports = router;