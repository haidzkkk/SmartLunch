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
router.post("/category", authenticate, upload.array("images", 1), categoryController.addCategory)
router.post("/updateCategory/:id", authenticate, authorization, upload.array("images", 1), categoryController.updateCategory)
router.patch("/category/restore/:id", authenticate, authorization, categoryController.restoreCategory)
router.get("/categories", authenticate,categoryController.getAllCategories)
router.get( "/category/restore/:id",categoryController.restoreCategory );
router.get("/admin/category",authenticate,categoryController.getCategoryUI);




router.get("/admin/category/create",authenticate,categoryController.getCategoryCreateUI);

router.get('/categorybyadmin/category', categoryController.getCategory);


router.get('/admin/category/:id',authenticate, categoryController.getCategoryByIdUI);
router.post("/updatebyadmin/category/:id", categoryController.updateCategoryUI);
router.get("/remove/category/:id", categoryController.remove);


module.exports = router;
