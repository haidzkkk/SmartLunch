var joi = require('joi')
exports.statusSchema = joi.object({
    _id: joi.string(),
    status_name: joi.string().required().messages({
        "string.empty": "Trường tên trạng thái không được để trống",
        "any.required": "Trường tên trạng thái là bắt buộc",
    }),
    status_description: joi.string().required().messages({
        "string.empty": "Trường mô tả trạng thái không được để trống",
        "any.required": "Trường mô tả trạng thái là bắt buộc",
    })
})