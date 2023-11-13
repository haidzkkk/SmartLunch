var Banner = require('../models/banner')
var { uploadImage, updateImage } = require('../controllers/upload');

exports.getBanner = async (req, res, next) =>{
    try {
      const banners = await Banner.find();
      return res.status(200).json(banners);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
}

exports.postBanner = async (req, res, next) =>{
    try {
      var banner = req.body
      var files = req.files

      if(!files){
        return res.status(400).json({
            message: "Phải có ảnh",
          });
      }
      if(banner.type && banner.type > 0 && !banner.url){
        return res.status(400).json({
            message: "type > 0 phải có đường dẫn",
          });
      }

      var images = await uploadImage(files)
      banner.img = images[0]
      
      const bannerAdd =  await Banner.create(req.body);
      return res.status(200).json({
        message: 'Thêm banner thành công',
        data: bannerAdd,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
}


exports.deleteBanner = async (req, res, next) =>{
    const id = req.params.id;
    try {
      const banner = await Banner.findOneAndDelete({_id: id});
      if (!banner) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }
      res.json({ message: "Xoá status thành công", data: banner,});
    } catch (error) {
      res.status(500).json({ error: "Lỗi xoá status" });
    }
  }
