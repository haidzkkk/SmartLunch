var express = require("express")
var sizeController = require("../controllers/size.js")

var router = express.Router();

router.get("/size", sizeController.getSize);
router.get("/size/:id", sizeController.getSizeById);
router.get("/delete/size/:id", sizeController.removeSize);
router.post("/size", sizeController.createSize);
router.post("/size/:id", sizeController.updateSize);

router.get('/admin/size', sizeController.getSizeUI );
router.get('/admin/size/:id', sizeController.getSizeByIdUI);
module.exports = router;