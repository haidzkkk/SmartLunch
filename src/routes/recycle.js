var express = require('express');
var recycleController = require('../controllers/recycle')
var productController = require('../controllers/product')
var router = express.Router();

router.get('/admin/recycle',  recycleController.getProductDelete);
router.get("/deletebyadmin/products/:id", productController.removeProduct);
module.exports = router;