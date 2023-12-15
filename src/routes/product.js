
var express = require('express');
const multer = require('multer');
var productController = require('../controllers/product');
const { uploadImage } = require('../controllers/upload');
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;


var upload = require("../config/configApp").upload;


var router = express.Router();

router.get("/products", productController.getAll);
router.get("/products/delete", productController.getAllDelete);
router.get("/products/:id", productController.get);
router.get("/topViewedProducts",authenticate, productController.getTopViewedProducts);
router.delete("/products/:id",authenticate,authorization, productController.remove);
router.delete("/products/force/:id",authenticate,productController.removeForce);
router.post("/products", authenticate, authorization, upload.array("images", 10), productController.addProduct);
router.patch("/products/:id",authenticate,authorization,productController.updateProduct);
router.get("/products/restore/:id",authenticate,productController.restoreProduct);

router.get("/admin/products/create", authenticate,productController.getProductCreateUI);

router.get("/productbyadmin/products", productController.getProduct);
router.delete("/products/:id", authenticate, authorization, productController.remove);
router.delete("/products/force/:id", productController.removeForce);
router.post("/products",authenticate,authorization,upload.array("images", 10), productController.addProduct);
router.post("/products/:id", authenticate, authorization,upload.array("images", 10), productController.updateProduct);
router.patch("/products/restore/:id", authenticate, authorization, productController.restoreProduct);
router.get("/products/views/:id",authenticate, productController.viewProduct);
router.get("/products/search/:text",authenticate, productController.searchProductByName);
router.get("/category/products/:categoryId", productController.getProductByCategoryId)
router.get('/productbyadmin/products', productController.getProduct);
router.get("/deletebyadmin/products/:id",productController.removeProduct);
router.get("/remove/products/:id", productController.remove);
router.post("/updatebyadmin/products/:id", upload.array("images", 10) ,productController.updateProduct);
router.get('/admin/products',authenticate, productController.getProductUI);
router.get('/admin/products/:id',authenticate, upload.array("images", 10),productController.getProductByIdUI);
router.get('/productbyadmin/products', productController.getProduct);
router.get("/deletebyadmin/products/:id",authenticate,productController.removeProduct);
router.get("/remove/products/:id",authenticate, productController.remove);
router.post("/updatebyadmin/products/:id",authenticate, upload.array("images", 10) ,productController.updateProduct);
router.patch("/toggleActive/:productId", authenticate, productController.toggleActive);
router.get("/removeProduct", authenticate, productController.removeAllProduct);
router.patch("/restoreProductAll", authenticate, productController.restoreProductAll);


module.exports = router;

