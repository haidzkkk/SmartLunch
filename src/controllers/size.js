var  Size  = require ("../models/size.js")
var SizeSchema = require("../schemas/size.js")

exports.getSize = async (req, res) => {
  try {
    const size = await Size.find();
    return res.status(200).json(
      size
    );
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

    return res.status(200).json(
      size
    );
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

exports.createSize = async (req, res,next) => {
    try{
        const sizeBody = req.body;
        const size = await Size.create(sizeBody);
        return res.status(200).json(
          size
        );
    }catch(err){
      return res.status(400).json({
        message: error,
      });
    }
};

exports.removeSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    return res.status(200).json(
      size
    );
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
    const size = await Size.findByIdAndUpdate(id, body, { new: true, });
    return res.status(200).json(
      size
    )
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}