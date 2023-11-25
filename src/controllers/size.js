var Size = require("../models/size.js")
var Product = require("../models/product.js")
var SizeSchema = require("../schemas/size.js")

exports.getSize = async (req, res) => {
  try {
    const size = await Size.find().populate("productId");
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

    return res.status(200).json(size);
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

exports.getSizeByProductId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Lỗi id: " + id);
    const sizes = await Size.find({productId: id});

    return res.status(200).json(
      sizes
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

    const product = await Product.findById(sizeBody.productId)
    if(!product){
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    await Size.create(sizeBody);
    res.status(303).set('Location', '/api/admin/size').send();
  } catch (err) {
    return res.status(400).json({
      message: err,
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
    const {name, price} = req.body;
    const size = await Size.findByIdAndUpdate(id, {size_name: name, size_price: price}, { new: true, });
    res.status(303).set('Location', '/api/admin/size').send();
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}