var Product = require("../models/product.js");
var Category = require("../models/category.js");
var ProductSchema = require("../schemas/product.js").ProductSchema;
const cloudinary = require("cloudinary").v2;
var { uploadImage, updateImage } = require("../controllers/upload");
const fetch = require('node-fetch');

exports.getProductUI = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/productbyadmin/products');
  const data = await response.json();
  res.render('product/product', { data,layout :"Layouts/home" });
};
exports.getProductDelete = async (req, res) => {
  const responsex = await fetch('http://localhost:3000/api/products/delete');
  const dataDelete = await responsex.json();
  res.render('recyclebin/recycle', { dataDelete,layout :"Layouts/home" });
};
exports.getProductByIdUI = async (req, res) => {
  const response = await fetch(
    "http://localhost:3000/api/products/" + req.params.id
  );
  const data = await response.json();
  res.render("product/detail", { data, layout: "Layouts/home" });
};
exports.removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(303).set("Location", "/api/admin/products").send();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
exports.updateProductUI = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    res.status(303).set("Location", "/api/admin/products").send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
exports.getTopViewedProducts = async (req, res) => {
  try {
    const topViewedProducts = await Product.find().sort({ views: -1 }).limit(5);
    res.status(200).json(topViewedProducts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


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
  };
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
    res.status(303).set('Location', '/api/admin/products').send();
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
    res.status(303).set('Location', '/api/admin/recycle').send();
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
    const files = req.files;

    // Kiểm tra dữ liệu từ req.body bằng cách sử dụng Joi schema
    const { error } = ProductSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: "Lỗi trong dữ liệu đầu vào",
        errors: errors,
      });
    }

    // Kiểm tra xem có hình ảnh được tải lên hay không
    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại, chưa có ảnh tải lên",
      });
    }

    // Gọi hàm uploadImage để tải lên hình ảnh
    const images = await uploadImage(files);

    if (images.length === 0) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại, lỗi trong quá trình tải lên hình ảnh",
      });
    }

    // Gán mảng hình ảnh vào thuộc tính images của sản phẩm
    body.images = images;

    // Tạo sản phẩm mới trong cơ sở dữ liệu
    const product = await Product.create(body);

    if (!product) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }

    res.status(303).set("Location", "/api/admin/products").send();
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({
      message: "Lỗi server",
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
    res.status(200).json("thanh cong ");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
  }
};

exports.getProductByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Lấy categoryId từ tham số URL

    // Tìm tất cả sản phẩm có categoryId tương ứng
    const products = await Product.find({ categoryId: categoryId });

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
