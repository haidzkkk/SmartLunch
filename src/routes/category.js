var express = require('express');
var categoryController= require('../controllers/category');
const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

var router = express.Router();

router.get("/category", categoryController.getAllCategory)
router.get("/category/delete", categoryController.getAllDelete)
router.get("/category/:id", categoryController.getCategoryById)
router.delete("/category/:id", authenticate, authorization, categoryController.removeCategory)
router.delete("/category/force/:id", authenticate, authorization, categoryController.removeForce)
router.post("/category", authenticate,authorization, upload.array("images", 1), categoryController.addCategory)
router.patch("/category/:id", authenticate, authorization, upload.array("images", 1), categoryController.updateCategory)
router.patch("/category/restore/:id", authenticate, authorization, categoryController.restoreCategory)

module.exports = router;
