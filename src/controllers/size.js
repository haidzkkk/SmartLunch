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

    if(!size){
      return res.status(404).json({message: "Không tìm thấy size"});
    }
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
    const sizes = await Size.find({productId: id});

    if(!sizes){
      return res.status(404).json({message: "Không tìm thấy size"});
    }
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

    // Kiểm tra sự tồn tại của sản phẩm
    const product = await Product.findById(sizeBody.productId);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    console.log("Size Body:", sizeBody);

    // Kiểm tra xem kích thước đã tồn tại chưa
    const existingSize = await Size.findOne({
      size_name: sizeBody.size_name,
      productId: sizeBody.productId,
    });

    if (existingSize) {
      return res.status(400).json({
        message: "Kích thước đã tồn tại cho sản phẩm này",
      });
    }

    // Kiểm tra giá của kích thước
    if (sizeBody.size_price <= 0) {
      return res.status(400).json({
        message: "Giá của kích thước phải lớn hơn 0",
      });
    }

    // Tạo một đối tượng Size mới
    const newSize = new Size({
      size_name: sizeBody.size_name,
      size_price: sizeBody.size_price,
      productId: sizeBody.productId,
    });

    // Lưu đối tượng Size vào cơ sở dữ liệu
    await newSize.save();
    this.updatePriceProduct(product)
    // Định dạng lại phản hồi và chuyển hướng
    res.status(201).json({
      message: "Kích thước đã được tạo thành công",
      size: newSize,
    });
  } catch (err) {
    console.error("Error creating size:", err);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi tạo kích thước",
      error: err.message,
    });
  }
};





exports.removeSize = async (req, res) => {
  try {
    // Thực hiện việc xóa kích thước dựa trên ID được truyền từ tham số đường dẫn (req.params.id)
    const size = await Size.findByIdAndDelete(req.params.id);

    const product = await Product.findById(size.productId);
    this.updatePriceProduct(product)
    // Kiểm tra xem size có tồn tại không
    if (!size) {
      return res.status(404).json({
        message: 'Size not found',
      });
    }

    // Nếu xóa thành công, trả về 303 See Other và chuyển hướng đến trang danh sách kích thước
    res.status(303).set('Location', '/api/admin/size').send();
  } catch (error) {
    // Xử lý lỗi và trả về 400 Bad Request nếu có lỗi xảy ra
    return res.status(400).json({
      message: error.message || 'An error occurred while deleting the size',
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

exports.updatePriceProduct = async (product) => {
  const sizes = await Size.find({ productId: product._id }).sort({ size_price: 1 });
  product.product_price = sizes[0].size_price
  product.save()
}