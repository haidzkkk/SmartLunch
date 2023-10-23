var multer = require("multer") ;
var CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
var cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DATN",
        format: "png",
    }
});

exports.upload = multer({ storage: storage });

