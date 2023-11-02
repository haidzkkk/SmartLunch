
var express = require('express');
const multer = require('multer');
var productController = require('../controllers/product');
const { uploadImage } = require('../controllers/upload');
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;


var upload = require("../config/configApp").upload;

var coloutdinary = require("../config/cloudinary");
var router = express.Router();

router.get("/products", productController.getAll);
router.get("/products/delete", productController.getAllDelete);
router.get("/products/:id", productController.get);

router.delete("/products/:id",authenticate,authorization, productController.remove
);
router.delete("/products/force/:id",authenticate,authorization,productController.removeForce);
router.post("/products", authenticate, authorization, upload.array("images", 10), productController.addProduct);
router.patch("/products/:id",authenticate,authorization,productController.updateProduct
);
router.patch(
  "/products/restore/:id",
  authenticate,
  authorization,
  productController.restoreProduct
);
router.get("/products/views/:id", productController.viewProduct);
router.get("/category/products/:categoryId",productController.getProductByCategoryId);
router.get("/admin/products", productController.getProductUI);
router.get("/admin/products/:id", productController.getProductByIdUI);
// router.post("/admin/create/products",upload.array("images", 10), productController.addProductUi);
router.get("/productbyadmin/products", productController.getProduct);

router.delete("/products/:id", authenticate, authorization, productController.remove);
router.delete("/products/force/:id", authenticate, authorization, productController.removeForce);
router.post("/products", authenticate, authorization , upload.array("images", 10), productController.addProduct);
router.patch("/products/:id", authenticate, authorization, productController.updateProduct);
router.patch("/products/restore/:id", authenticate, authorization, productController.restoreProduct);
router.get("/products/views/:id", productController.viewProduct);
router.get("/category/products/:categoryId", productController.getProductByCategoryId)
router.get('/admin/products', productController.getProductUI);
router.get('/admin/products/:id', productController.getProductByIdUI);
router.get('/productbyadmin/products', productController.getProduct);
router.get("/deletebyadmin/products/:id", productController.removeProduct);
router.get("/remove/products/:id", productController.remove);
router.post("/updatebyadmin/products/:id", productController.updateProductUI);

module.exports = router;

