var express = require('express');
var recycleController = require('../controllers/recycle')
var productController = require('../controllers/product')
var categoryController= require('../controllers/category');

var router = express.Router();

router.get('/admin/recycle',  recycleController.getProductDelete);
router.get("/deletebyadmin/products/:id", productController.removeProduct);
router.get('/admin/recycle_category',  recycleController.getCategoryDelete);
router.get("/deletebyadmin/category/:id", categoryController.removeCategory);


module.exports = router;