var  Size  = require ("../models/size.js")
var SizeSchema = require("../schemas/size.js")

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

exports.createSize = async (req, res,next) => {
    try{
        var size = req.body;
        await Size.create(size);
        res.status(200).json("add thành công");
    }catch(err){
        res.status(400).json("add thất bại");
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
    const size = await Size.findByIdAndUpdate(id,body);
       res.status(200).json(size)  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating status" });
  }
}