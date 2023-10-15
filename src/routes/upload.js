var express = require('express');
var multer = require("multer") ;
var CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
var cloudinary = require('../config/cloudinary')
var uploadController = require('../controllers/upload')
var router = express.Router();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DATN",
        format: "png",
    }
});

const upload = multer({ storage: storage });


router.post("/images/upload", upload.array("images", 10), uploadController.uploadImage);
router.delete("/images/:publicId", uploadController.deleteImage);
router.put("/images/:publicId", upload.array("images", 10), uploadController.updateImage);

module.exports = router;