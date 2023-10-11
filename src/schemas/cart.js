var Joi = require('joi')

exports.cartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'productId không được để trống.',
    'string.base': 'productId phải là một chuỗi.',
  }),
  product_name: Joi.string().messages({
    'string.base': 'product_name phải là một chuỗi.',
  }),
  product_price : Joi.number().messages({
    'number.base': 'product_price phải là một số.',
  }),
  image: Joi.string().messages({
    'string.base': 'image phải là một chuỗi.',
  }),
  purchase_quantity: Joi.number().messages({
    'number.base': 'purchase_quantity phải là một số.',
  }),

  sizeId: Joi.string().required().messages({
    'any.required': 'Size không được để trống.',
    'string.base': 'Size phải là một chuỗi.',
  }),

});
