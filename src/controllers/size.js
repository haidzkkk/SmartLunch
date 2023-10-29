var Size = require("../models/size.js")
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
exports.getSizeUI = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/size');
  const data = await response.json();
  res.render('size/size', { data,layout :"Layouts/home" } );
};
exports.getSizeByIdUI = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/size/' + req.params.id);
  const data = await response.json();
  res.render('size/detail', { data,layout :"Layouts/home" } );
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

exports.createSize = async (req, res, next) => {
  try {
    const sizeBody = req.body;
    const size = await Size.create(sizeBody);
    res.status(303).set('Location', '/api/admin/size').send();
  } catch (err) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.removeSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    res.status(303).set('Location', '/api/admin/size').send();
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
    res.status(303).set('Location', '/api/admin/size').send();
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}