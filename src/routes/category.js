var express = require("express");
var router = express.Router();
var categoryController = require("../controller/category");

//Lấy danh sách;

router.get('/category', categoryController.listtl);

router.get('/category', categoryController.tladd);
router.post('/category', categoryController.tladd);

router.get('/deletetl/:idsp', categoryController.deletetl);
router.post('/deletetl/:idsp', categoryController.deletetl);

router.get('/edittl/:idsp', categoryController.edittl);
router.post('/edittl/:idsp', categoryController.edittl);

router.get('/sanpham.ejs/:id',categoryController.loctheoLoai);
module.exports = router;