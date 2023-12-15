var Joi = require ("joi");

exports.orderSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        "string.empty": "ID người dùng bắt buộc nhập",
        "any.required": "Trường ID người dùng bắt buộc nhập",
        "string.base": "ID người dùng phải là string"
    }),
    couponId: Joi.string().allow(null),
    shiperId: Joi.string().allow(null), 
    discount: Joi.number().allow(null),
    products: Joi.array().allow(null),
    total: Joi.number().allow(null),
    totalAll: Joi.number().allow(null),
    status: Joi.string().allow(null),
    statusPayment: Joi.string().allow(null),
    address: Joi.string(),
    notes: Joi.string().allow(null),
    data: Joi.string().allow(''),
    isPayment: Joi.boolean().allow(null),
})