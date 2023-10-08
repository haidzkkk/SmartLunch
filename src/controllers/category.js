var categorySchema=require ('../schemas/category.js')
var Category = require ('../models/category.js')


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
    return res.status(200).json({
      message: "Lấy tất cả danh mục thành công!",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.getAllDelete = async (req, res) => {
  try {
    const category = await Category.findWithDeleted({ deleted: true });
    return res.status(200).json({
      message: "Lấy tất cả danh mục đã bị xóa",
      category
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
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
    return res.status(200).json({
      message: "Lấy 1 danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.deleteById(id);
    return res.status(200).json({
      message: "Xoá Danh mục thành công.!",
      category
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.removeForce = async (req, res) => {
  try {
    const category = await Category.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      message: "Xoá sản phẩm vĩnh viễn",
      category
    })
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
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
    const category = await Category.create(formData);
    if (!category || category.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json({
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const restoredCategory = await Category.restore({ _id: req.params.id }, { new: true });
    if (!restoredCategory) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
      });
    }

    return res.status(200).json({
      message: "Khôi phục sản phẩm thành công.",
      category: restoredCategory,
    });
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
    const { error } = categorySchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const category = await Category.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "Cập nhật danh mục thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
