var express = require("express")
var sizeController = require("../controllers/size.js")

var router = express.Router();

router.get("/size", sizeController.getSize);
router.get("/size/:id", sizeController.getSizeById);
router.delete("/size/:id", sizeController.removeSize);
router.post("/size", sizeController.createSize);
router.patch("/size/:id", sizeController.updateSize);


module.exports = router;