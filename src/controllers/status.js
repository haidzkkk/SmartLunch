
var Status = require('../models/status')

var statusSchema = require("../schemas/status").statusSchema

exports.status = async (req, res, next) =>{
  try {
    const status = await Status.find();
    if (status.length === 0) {
      return res.status(404).json({
        message: 'Lấy tất cả trạng thái thất bại',
      });
    }
    return res.status(200).json({
      message: " Lấy tất cả trạng thái thành công",
      status
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}



exports.addstatus= async (req, res, next) =>{
  try {
    const { error } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const status = await Status.create(req.body);
    if (!status) {
      return res.status(400).json({
        message: 'Thêm trạng thái thất bại',
      });
    }
    return res.status(200).json({
      message: 'Thêm trạng thái thành công',
      status,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}

exports.deletestatus = async (req, res, next) =>{
    const id = req.params.id;
    try {
      const status = await Status.findOneAndDelete({
        _id: id
      });
      if (!status) {
        return res.status(404).json({ error: "Không tìm thấy status" });
      }
      res.json({ message: "Xoá status thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi xoá status" });
    }
  }


  exports.updatestatus = async (req, res, next) =>{
    try {
      const id = req.params.id;
      const body = req.body;
      const { error } = statusSchema.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => err.message)
        return res.status(400).json({
          message: errors
        })
      }
      const status = await Status.findByIdAndUpdate(id, body, { new: true, });
      if (!status) {
        return res.status(404).json({
          message: 'Cập nhật trạng thái thất bại',
        });
      }
      return res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        status
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message
      })
    }
}
  
  