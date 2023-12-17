var categorySchema = require("../schemas/category.js").categorySchema;
var { uploadImage, updateImage } = require('../controllers/upload');
var Category = require("../models/category.js");
const fetch = require('node-fetch');



exports.getCategoryUI = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/categorybyadmin/category');
  const data = await response.json();
  res.render('category/category', { data,layout :"Layouts/home" });
};

exports.getCategoryCreateUI = async (req, res) => {
  const token = res.locals.token;
  console.log("aaaaaaaaaa");
  console.log("Token:", token);
  res.render('category/addCategory', { layout: 'Layouts/home', token });
}

exports.getCategoryByIdUI = async (req, res) => {
  const response = await fetch(
    "http://localhost:3000/api/category/" + req.params.id
  );
  const data = await response.json();
  res.render("category/detail", { data, layout: "Layouts/home" });
};

exports.getCategoryDelete = async (req, res) => {
  const responsex = await fetch('http://localhost:3000/api/category/delete');
  const dataDelete = await responsex.json();
  res.render('recyclebin/recycle_category', { dataDelete,layout :"Layouts/home" });
};


exports.removeCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(303).set("Location", "/api/admin/category").send();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}
exports.updateCategoryUI = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    res.status(303).set("Location", "/api/admin/category").send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

exports.getAllCategory = async (req, res) => {
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
    const category = await Category.paginate(searchQuery, options);
    if (category.length === 0) {
      return res.status(404).json({
        message: "Không có danh mục!",
      });
    }
    return res.status(200).json(
      category,
    );
  } catch (error) {
    console.error(
      "Lỗi trong quá trình xử lý yêu cầu hoặc truy vấn cơ sở dữ liệu:",
      error
    );
    return res.status(400).json({
      message:
        "Có lỗi xảy ra trong quá trình xử lý yêu cầu hoặc truy vấn cơ sở dữ liệu.",
      error: error.message, // Trả về thông báo lỗi cụ thể (nếu có)
    });
  }
};



exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}
exports.getAllDelete = async (req, res) => {
  try {
    const category = await Category.findWithDeleted({ deleted: true });
    return res.status(200).json(   
      category,
    );
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json( 
      category,
    );
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


exports.removeForce = async (req, res) => {
  try {
    const category = await Category.deleteOne({ _id: req.params.id });
    return res.status(200).json(      
      category,
    );
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};




exports.addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    var files = req.files 
    
    const formData = req.body;
    const data = await Category.findOne({ category_name });
    if (data) {
      return res.status(400).json({
        message: "Danh mục đã tồn tại",
      });
    }
    const { error } = categorySchema.validate(formData, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    var images = await uploadImage(files)
    if(images[0] == null){
      return res.status(400).json({
        message: "Thêm danh mục thất bại, chưa có ảnh tải lên",
      });
    }
    formData.category_image = images[0]

    const category = await Category.create(formData);
    if (!category || category.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const restoredCategory = await Category.restore(
      { _id: req.params.id },
      { new: true }
    );
    if (!restoredCategory) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
      });
    }
    res.status(303).set('Location', '/api/admin/category').send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    var files = req.files 

    const { error } = categorySchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    var images = await updateImage(files)
    body.category_image = images

    const category = await Category.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "Cập nhật danh mục thất bại",
      });
    }
    res.status(303).set('Location', '/api/admin/category').send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};




exports.getCategory = async (req, res) => {
  try {
    const data = await Category.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (category) {
      await category.delete();
    }
    res.status(303).set('Location', '/api/admin/recycle_category').send();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
exports.removeAll = async (req, res) => {
  try {
    const categories = await Category.find();

    // Lặp qua từng danh mục và xóa
    for (const category of categories) {
      await category.delete();
    }

    res.status(303).set('Location', '/api/admin/recycle_category').send();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};