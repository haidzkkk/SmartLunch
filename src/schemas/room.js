var joi = require('joi')

exports.roomSchema = joi.object({
    _id: joi.string().required().messages({
        'any.required': '_id không được để trống.',
        'string.base': '_id phải là một chuỗi.',
    }),
    shopUserId: joi.string().required().messages({
        'any.required': 'shopUserId không được để trống.',
        'string.base': 'shopUserId phải là một chuỗi.',
    }),
    userUserId: joi.string().required().messages({
        'any.required': 'userUserId không được để trống.',
        'string.base': 'userUserId phải là một chuỗi.',
    }),
    userIdSend: joi.string().required().messages({
        'any.required': 'userIdSend không được để trống.',
        'string.base': 'userIdSend phải là một chuỗi.',
    }),
    messSent: joi.string().required().messages({
        "string.empty": "messSent không được để trống",
    }),
    timeSent: joi.date().required().messages({
        "string.empty": "date không được để trống",
    }),
    // seen: joi.string().required().messages({
    //     "string.empty": "messSent không được để trống",
    // }),
})