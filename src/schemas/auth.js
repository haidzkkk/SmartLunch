var joi = require('joi')

exports.loginSchema = joi.object({
    email: joi.string().required().messages({
        "string.empty": "Mời nhập email ",
    }),
    password: joi.string().required().messages({
        "string.empty": "Mật khẩu không được để trống",
    }),
})