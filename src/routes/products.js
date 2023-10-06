var express = require('express');
var productController = require('../controllers/product')
var router = express.Router();


router.get("/product", productController.list);


router.get("/add", productController.add);
router.post('/add',productController.add);


router.get('/edit/:idsp', productController.edit);
router.post('/edit/:idsp', productController.edit);

router.get('/delete/:idsp', productController.delete);
router.post('/delete/:idsp', productController.delete);

router.get('/show/:idsp', productController.show);
router.post('/show/:idsp', productController.show);

module.exports = router;