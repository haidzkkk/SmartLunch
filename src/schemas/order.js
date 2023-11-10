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
    total: Joi.number().min(0).required().messages({
        "number.min": "Không được nhập số âm"
    }),
    consignee_name: Joi.string(),
    phone: Joi.string(),
    status: Joi.string().allow(null),
    statusPayment: Joi.string().allow(null),
    address: Joi.string(),
    notes: Joi.string().allow(null),
    isPayment: Joi.boolean().allow(null),
})