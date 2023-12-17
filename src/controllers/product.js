var Product = require("../models/product.js");
var ProductSchema = require("../schemas/product.js").ProductSchema;
var { uploadImage, updateImage } = require("../controllers/upload");
const fetch = require('node-fetch');
const { response } = require("express");

exports.getProductUI = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/productbyadmin/products');
  const data = await response.json();
  const formattedPrice = (this.product_price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  res.render('product/product', { data,formattedPrice,layout :"Layouts/home" });
};

exports.getProductCreateUI = async (req, res) => {

  res.render('product/create', { layout: 'Layouts/home' });
}
exports.getProductPreview = async (req, res) => {
  
  const token = res.locals.token;

  res.render('product/create', { layout: 'Layouts/home', token });
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

exports.searchProductByName= async(req,res)=>{
  try {
    const textSearch = req.params.text
    const products = await Product.find({
        $and: [
            {
                $or: [
                    { product_name: { $regex: new RegExp(textSearch, "i") } },
                ],
            }
        ],
    });
    res.status(200).json(products)
} catch (error) {
    return res.status(400).json({
        message: error.message
    })
}
}


exports.getAll = async (req, res) => {
  const {
    _limit = 10,
    _sort = "createAt", 
    _order = "desc",
    _page = 1,
    q,              // q: query tìm kiếm theo tên sp  -> api?_limit=10&_sort=bought&_order=desc&_page=1&q=iphone 
  } = req.query;
  
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "desc" ? -1 : 1,
    }
  };
  
  const searchQuery = q 
  ? { 
      product_name: {$regex: new RegExp(q), $options: 'i'},
      isActive: true
    } 
  : {isActive: true};
  // const searchQuery = q ? { product_name: {$regex: new RegExp('.*' + q.toLowerCase() + '.*'), $options: 'i'} } : {};

  try {
    const products = await Product.paginate(searchQuery, options);
    return res.status(200).json(products);
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
    res.status(303).set('Location', '/api/admin/recycle').send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
exports.restoreProductAll = async (req, res) => {
  try {
    const ids = req.params.id.split(','); // Split the comma-separated IDs
    const restoredProducts = await Product.restore({ _id: { $in: ids } });

    if (!restoredProducts || restoredProducts.length === 0) {
      return res.status(400).json({
        message: "No products were restored. They may not exist or have been restored before.",
      });
    }

    res.status(303).set('Location', '/api/admin/products').send();
  } catch (error) {
    console.error('Error restoring products:', error.stack);
    return res.status(500).json({
      message: 'Internal Server Error',
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
    var files = req.files;

    const { error } = ProductSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Check if the price is not less than or equal to 0
    if (body.product_price < 0) {
      return res.status(400).json({
        message: "Giá sản phẩm phải lớn hơn 0",
      });
    }

    var images = await uploadImage(files);
    if (images[0] == null) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại, chưa có ảnh tải lên",
      });
    }
    body.images = images;

    const product = await Product.create(body);
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
    const files = req.files;
    console.log(files);
    const { error } = ProductSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
   
    // Check if files (images) are provided
    if (files && files.length > 0) {
      var images = await uploadImage(files);
      if (images[0] == null) {
        return res.status(400).json({
          message: "Thêm sản phẩm thất bại, chưa có ảnh tải lên",
        });
      }
      body.images = images;
    }

    const product = await Product.findByIdAndUpdate(id, body);
    if (!product) {
      return res.status(400).json({
        message: "Cập nhật sản phẩm thất bại",
      });
    }
    
    res.status(303).set("Location", "/api/admin/products").send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};



exports.toggleActive = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // Đảo ngược trạng thái isActive
    product.isActive = !product.isActive;

    // Lưu sản phẩm đã cập nhật
    await product.save();

    res.status(200).json({
      message: "Trạng thái isActive đã được cập nhật",
      isActive: product.isActive,
    });
  } catch (err) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật trạng thái isActive",
      error: err,
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
    const categoryId = req.params.categoryId;

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
exports.removeAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    // Loop through each product and delete
    for (const product of products) {
      await product.delete();  // Corrected method name to delete()
    }

    res.status(303).set('Location', '/api/admin/recycle').send();
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
