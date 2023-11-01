var Joi = require ("joi");

exports.orderSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        "string.empty": "ID người dùng bắt buộc nhập",
        "any.required": "Trường ID người dùng bắt buộc nhập",
        "string.base": "ID người dùng phải là string"
    }),
    couponId: Joi.string().allow(null),
    discount: Joi.number().min(0).required().messages({
        "number.min": "Không được nhập số âm"
    }),
    products: Joi.array().required(),
    consignee_name  : Joi.string().required().messages({
        "string.empty": "người nhận bắt buộc nhập",
        "any.required": "người nhận bắt buộc nhập",
        "string.base": "người nhận phải là string"
    }),
    total: Joi.number().min(0).required().messages({
        "number.min": "Không được nhập số âm"
    }),
    status: Joi.string(),
    phone: Joi.string().max(10).required().messages({
        "string.empty": "Mời điền số điện thoại",
        "any.required": "Bắt buộc thêm số điện thoại",
        "string.max": "Số phải phải có ít hơn 10 số",
    }),
    address: Joi.string().required().messages({
        "string.empty": "Thêm địa chỉ ",
        "any.required": 'Trường "Địa chỉ" là bắt buộc',
    }),
    notes: Joi.string().allow(null),
    paymentId: Joi.string(),
    paymentCode: Joi.string(),
    payerId: Joi.string()
})