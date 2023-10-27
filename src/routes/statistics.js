var express = require('express');
var productController = require('../controllers/product')


router.get('/admin/statistics ', productController.getProductUI);
module.exports = router;