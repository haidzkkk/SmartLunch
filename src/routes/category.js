var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/category");

//Lấy danh sách;

router.get('/category', categoryController.categoryAdd);

router.get('/category', categoryController.listCategory);
router.post('/category', categoryController.listCategory);

router.get('/deletetl/:idsp', categoryController.deleteCategory);
router.post('/deletetl/:idsp', categoryController.deleteCategory);

router.get('/edit/:idsp', categoryController.editCategory);
router.post('/edit/:idsp', categoryController.editCategory);


module.exports = router;