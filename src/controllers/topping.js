var Topping = require("../models/topping.js")
var Product = require("../models/product.js")

exports.getTopping = async (req, res) => {
  try {
    const topping = await Topping.find().populate("productId");
    return res.status(200).json(topping);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getToppingById = async (req, res) => {
    try {
      const id = req.params.id;
      const topping = await Topping.findById(id);
        
      if(!topping){
        return res.status(404).json({message: "Không tìm thấy topping"});
      }
      return res.status(200).json(topping);
    } catch (error) {
      return res.status(400).json({
        message: error,
      })
    }
  };

  exports.getToppingByProductId = async (req, res) => {
    try {
      const id = req.params.id;
      const toppings = await Topping.find({productId: id, isActive: true});
      if(!toppings){
        return res.status(404).json({message: "Không tìm thấy size"});
      }
      return res.status(200).json(toppings );
    } catch (error) {
      return res.status(400).json({
        message: error,
      })
    }
  };

  exports.createTopping = async (req, res, next) => {
    try {
      const toppingBody = req.body;
  
      // Kiểm tra sự tồn tại của sản phẩm
      const product = await Product.findById(toppingBody.productId);
      if (!product) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại",
        });
      }
  
      // Tạo một đối tượng Size mới
      const newTopping = new Topping({
        name: toppingBody.name,
        price: toppingBody.price,
        productId: toppingBody.productId,
      });
  
      // Lưu đối tượng Size vào cơ sở dữ liệu
      await newTopping.save();
  
      // Định dạng lại phản hồi và chuyển hướng
      res.status(201).json({
        message: "topping đã được tạo thành công",
        data: newTopping,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Có lỗi xảy ra khi tạo topping",
        error: err.message,
      });
    }
  };

  exports.updateTopping = async (req, res) => {
    try {
      const id = req.params.id;
      const {name, price} = req.body;
      const topping = await Topping.findByIdAndUpdate(id, {name, price}, { new: true, });
      if(!topping){
        return res.status(404).json({message: "Không tìm thấy topping"});
      }
    //   res.status(303).set('Location', '/api/admin/size').send();
      res.status(200).json(topping)
    } catch (error) {
      return res.status(400).json({
        message: error.message
      })
    }
  }

  exports.removeTopping = async (req, res) => {
    try {
      const topping = await Topping.findByIdAndDelete(req.params.id);
      if(!topping){
        return res.status(404).json({message: "Không tìm thấy topping"});
      }
    //   res.status(303).set('Location', '/api/admin/').send();
      res.status(200).json(topping)
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };

  exports.toggleActive = async (req, res) => {
    try {
      const toppingId = req.params.id;
  
      const topping = await Topping.findById(toppingId);
  
      if (!topping) {
        return res.status(404).json({
          message: "topping không tồn tại",
        });
      }
  
      // Đảo ngược trạng thái isActive
      topping.isActive = !topping.isActive;
  
      // Lưu sản phẩm đã cập nhật
      await topping.save();
  
      res.status(200).json({
        message: "Trạng thái isActive đã được cập nhật",
        isActive: topping.isActive,
      });
    } catch (err) {
      res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật trạng thái isActive",
        error: err,
      });
    }
  };
  