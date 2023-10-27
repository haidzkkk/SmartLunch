var multer = require("multer") ;
var CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
var cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DATN",
        // format: "png",
        resource_type: "auto",
        allowedFormats: ['jpg', 'png', 'mp4'],
    }
});

exports.upload = multer({ storage: storage });

