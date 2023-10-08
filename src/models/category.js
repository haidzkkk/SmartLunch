var mongoose = require('mongoose')

 const productSchema= new mongoose.Schema(
    {   
        id_theloai:{type: mongoose.Schema.Types.ObjectId, ref:'categoryModel'}
    },
    {
        collection:'product'
    }
 );
 let  productModel= mongoose.model('productModel', productSchema);

 const categoryiSchema= new mongoose.Schema(
    {
        name:{type:String, require:true}
    },
    {collection:'category'}
 );
 let categoryModel= mongoose.model('categoryModel',categoryiSchema);
 module.exports={categoryModel, productModel};