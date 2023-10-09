var Joi = require("joi")

exports.sizeSchema = Joi.object({
    _id: Joi.string(),
    size_name: Joi.string().required().messages({
        "string.empty": "Tên size không được để trống",
        "any.required": "Trường tên size bắt buộc nhập"
    }),
    size_price: Joi.number().required().messages({
        "number.empty": "Giá size bắt buộc nhập",
        "any.required": "Trường giá size bắt buộc nhập",
        "number.base": "Giá size phải là số"
    })
})
