var express = require('express');
var bannerController = require('../controllers/banner')
var router = express.Router();
const authorization = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

router.get('/banner', bannerController.getBanner);
router.post('/banner',authenticate, authorization, upload.array("images", 1), bannerController.postBanner);
router.delete('/banner/:id',authenticate, authorization, bannerController.deleteBanner);

module.exports = router;