var express = require('express');
var productController = require('../controllers/products')
var router = express.Router();


router.get('/products', productController.product);
router.post('/products', productController.addproduct);
// router.put('/products/:id', productController.updateproduct);
// router.delete('/products/:id', productController.deleteproduct);

module.exports = router;