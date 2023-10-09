var mongoose = require('mongoose')
var mongoosePaginate =  require ("mongoose-paginate-v2");
var mongooseDelete =  require ("mongoose-delete");
const categorySchema =new mongoose.Schema({


  category_name: {
    type: String,
    minLength: 3,
    maxlength: 50,
  },
  category_image: {
    type: Object,
    required: true
  },

  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    },
  ]

},
  { timestamps: true, versionKey: false });

  categorySchema.plugin(mongoosePaginate);
  categorySchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
 
let categoryModel = mongoose.model("Category", categorySchema)
module.exports = categoryModel

