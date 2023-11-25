var express = require('express');
var recycleController = require('../controllers/recycle')
var productController = require('../controllers/product')
var categoryController= require('../controllers/category');
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate;
var router = express.Router();

router.get('/admin/recycle',authenticate,  recycleController.getProductDelete);
router.get("/deletebyadmin/products/:id", productController.removeProduct);
router.get('/admin/recycle_category',authenticate,  recycleController.getCategoryDelete);
router.get("/deletebyadmin/category/:id", categoryController.removeCategory);


module.exports = router;