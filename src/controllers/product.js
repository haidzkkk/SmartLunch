var Product = require("../models/product.js");
var Category = require("../models/category.js");
var ProductSchema = require("../schemas/product.js").ProductSchema;
var { uploadImage, updateImage } = require('../controllers/upload');

exports.getAll = async (req, res) => {
  const {
    _limit = 10,
    _sort = "createAt",
    _order = "asc",
    _page = 1,
    q,
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order == "desc" ? -1 : 1,
    },
  }
  const searchQuery = q ? { name: { $regex: q, $options: "i" } } : {};
  try {
    const product = await Product.paginate(searchQuery, options);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.getAllDelete = async (req, res) => {
  try {
    const product = await Product.findWithDeleted({ deleted: true });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const restoredProduct = await Product.restore(
      { _id: req.params.id },
      { new: true }
    );
    if (!restoredProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
      });
    }
    return res.status(200).json({
      product: restoredProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm!",
      });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    // console.log(product);
    if (product) {
      await product.delete();
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.removeForce = async (req, res) => {
  try {
    const product = await Product.deleteOne({ _id: req.params.id });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const body = req.body;
    var files = req.files 

    const { error } = ProductSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    var images = await uploadImage(files)
    if(images[0] == null){
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại, chưa có ảnh tải lên",
      });
    }
    body.images = images

    const product = await Product.create(body);
    await Category.findOneAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    if (product.length === 0) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { categoryId } = req.body;
    const product = await Product.findById(id);
    const { error } = ProductSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    await Category.findByIdAndUpdate(product.categoryId, {
      $pull: {
        products: product._id,
      },
    });
    await Category.findByIdAndUpdate(categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    const data = await Product.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (data.length === 0) {
      return res.status(400).json({
        message: "Cập nhật sản phẩm thất bại",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }
    product.views += 1;
    await product.save();
    res.status(200).json(
      "thanh cong "     
  );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
  }
};

exports.getProductByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Lấy categoryId từ tham số URL

    // Tìm tất cả sản phẩm có categoryId tương ứng
    const products = await Product.find({ categoryId : categoryId});

    if (products.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào thuộc danh mục này",
      });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
