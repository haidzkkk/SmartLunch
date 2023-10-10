var  Joi = require("joi")

exports.couponSchema = Joi.object({
    _id: Joi.string(),
    coupon_name: Joi.string().required().messages({
        "string.empty": "Tên mã giảm giá bắt buộc nhập",
        "any.required": "Trường tên mã giảm giá bắt buộc nhập"
    }),
    coupon_code: Joi.string().required().messages({
        "string.empty": "Code giảm giá bắt buộc nhập",
        "any.required": "Trường code giảm giá bắt buộc nhập"
    }),
    coupon_content: Joi.string().required().messages({
        "string.empty": "Nội dung mã giảm giá bắt buộc nhập",
        "any.required": "Trường nội dung mã giảm giá bắt buộc nhập"
    }),
    coupon_quantity: Joi.number().min(0).required().messages({
        "number.empty": "Số lượng mã giảm giá bắt buộc nhập",
        "any.required": "Trường số lượng mã giảm giá bắt buộc nhập",
        "number.base": "Số lượng mã giảm giá phải là số",
        "number.min": "Không được nhập số âm"
    }),
    discount_amount: Joi.number().min(0).required().messages({
        "number.empty": "Số tiền giảm giá bắt buộc nhập",
        "any.required": "Trường số tiền giảm giá bắt buộc nhập",
        "number.base": "Số tiền giảm giá phải là số",
        "number.min": "Không được nhập số âm"
    }),
    expiration_date: Joi.date().required().messages({
        "any.required": "Ngày hết hạn mã giảm giá bắt buộc nhập",
    }),
    min_purchase_amount: Joi.number().min(0).messages({
        "number.base": "Tổng số tiền để được áp dụng phiếu giảm giá phải là số",
        "number.min": "Không được nhập số âm"
    }),
})