var express = require('express');
var productController = require('../controllers/product')
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;
var upload = require('../config/configApp').upload

var router = express.Router();

router.get("/products", productController.getAll);
router.get("/products/delete",productController.getAllDelete);
router.get("/products/:id", productController.get);
router.delete("/products/:id", authenticate, authorization, productController.remove);
router.delete("/products/force/:id", authenticate, authorization, productController.removeForce);
router.post("/products", authenticate, authorization, upload.array("images", 10), productController.addProduct);
router.patch("/products/:id", authenticate, authorization, productController.updateProduct);
router.patch("/products/restore/:id", authenticate, authorization, productController.restoreProduct);
router.get("/products/views/:id", productController.viewProduct);
router.get("/category/products/:categoryId", productController.getProductByCategoryId)


module.exports = router;