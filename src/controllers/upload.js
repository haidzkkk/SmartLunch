var cloudinary = require('../config/cloudinary')
const multer = require('multer');

exports.uploadImage = async (files) => {
    if (!Array.isArray(files)) {
      return null;
    }
  
    try {
      const uploadPromises = files.map((file) => {
        // Sử dụng Cloudinary API để upload file lên Cloudinary
        return cloudinary.uploader.upload(file.path);
      });
  
      // Chờ cho tất cả các file đều được upload lên Cloudinary
      const results = await Promise.all(uploadPromises);
  
      // Trả về kết quả là một mảng các đối tượng chứa thông tin của các file đã upload lên Cloudinary
      const uploadedFiles = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
  
      return uploadedFiles;
    } catch (error) {
      return null;
    }
  };

exports.deleteImage = async (req, res) => {
    const publicId = req.params.publicId;
    try {
        const result = await cloudinary.uploader.destroy('DATN/'+publicId);
        return res.status(200).json({ message: "Xóa ảnh thành công", result });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error deleting image" });
    }
};


exports.updateImage = async (files, publicId) => {
    if (!Array.isArray(files) || files.length === 0) {
        return null;
    }

    const newImage = files[0].path; // Lấy đường dẫn của ảnh mới
    try {
        // Upload ảnh mới lên Cloudinary và xóa ảnh cũ cùng lúc
        const [uploadResult, deleteResult] = await Promise.all([
            cloudinary.uploader.upload(newImage),
            cloudinary.uploader.destroy('DATN/'+publicId)
        ]);
        // Trả về kết quả với url và publicId của ảnh mới
        return { url: uploadResult.secure_url, publicId: uploadResult.public_id, deleteResult }
    } catch (error) {
        console.log(error);
        return null;
    }

};


