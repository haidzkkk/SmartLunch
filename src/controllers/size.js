var  Size  = require ("../models/size.js")
var SizeSchema = ("../schemas/size.js")

exports.getSize = async (req, res) => {
  try {
    const size = await Size.find();
    return res.status(200).json({
      message: " Lấy tất cả size thành công",
      size
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getSizeById = async (req, res) => {
  try {
    const id = req.params.id;
    const size = await Size.findById(id);

    return res.status(200).json({
      message: "Lấy 1 size thành công",
      size
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

exports.createSize = async (req, res) => {
  try {
    const { error } = SizeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const size = await Size.create(req.body);
    return res.status(200).json({
      message: 'Thêm size thành công',
      size,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.removeSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: 'Xóa size thành công',
      size,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.updateSize = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = SizeSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errors
      })
    }
    const size = await Size.findByIdAndUpdate(id, body, { new: true, });
    return res.status(200).json({
      message: "Cập nhật size thành công",
      size
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}