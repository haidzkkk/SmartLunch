var Joi = require('joi')
exports.ProductSchema = Joi.object({
    _id: Joi.string(),
    product_name: Joi.string().messages({
        "string.empty": "Tên sản phẩm bắt buộc nhập",
        "any.required": "Trường tên sản phẩm bắt buộc nhập"
    }),
    product_price: Joi.number().required().messages({
        "number.empty": "Giá sản phẩm bắt buộc nhập",
        "any.required": "Trường giá sản phẩm bắt buộc nhập",
        "number.base": "Giá sản phẩm phải là số"
    }),
    sold_quantity: Joi.number(),
    description: Joi.string(),
    views: Joi.number(),
    categoryId: Joi.string().required().messages({
        "string.empty": "Danh mục sản phẩm bắt buộc nhập",
        "any.required": "Trường danh mục sản phẩm bắt buộc nhập",
    "string.base": "Danh mục sản phẩm phải là chuỗi"
    }),
    images :Joi.array().allow(null)
  
})