var fs = require('fs');
var myMD= require('../models/product')
const {query}= require('express');

exports.list = async(req, res, next)=>{
  let dieu_kien_loc= null;
  // if(typeof(req.query.))
let list=await(myMD.productModel.find().populate('id_category'));
console.log(list);


//res.render('products/sanpham',{listSP:list});
}




exports.add =  async(req,res,next)=>{
  let msg = '';
  let listTL = await myMD.theloaiModel.find();
  if(req.method =='POST'){
      let objSP = new myMD.productModel();
 
      objSP.name = req.body.name;
      objSP.image= req.body.image;
      objSP.price = req.body.price;
      objSP.id_theloai = req.body.id_theloai;
      try {
          let new_sp = await (objSP.save());
          console.log(new_sp);
          msg = 'Thêm mới thành công';
        //  res.redirect('/product');
          
      } catch (error) {
          msg = 'Lỗi '+ error.message;
          console.log(error);
      }
  }

//  res.render('products/add_sanpham', {msg: msg, listTL:listTL });
}




exports.edit = async (req,res,next)=>{
  let msg = '';
  let idsp = req.params.idsp;
  let objSP = await (myMD.productModel.findById(idsp));
  let listTL = await (myMD.categoryModel.find());
  if(req.method =='POST'){
      let objSP = new myMD.productModel();
      objSP.name = req.body.name;
      objSP.price = req.body.price;
     objSP.image=req.body.image;
      objSP.id_theloai = req.body.id_theloai;
      objSP._id = idsp;
      try {
          // let new_sp = await objSP.save();
          // console.log(new_sp);
          // msg = 'Thêm mới thành công';

          await (myMD.productModel.findByIdAndUpdate(idsp, objSP));
          msg = 'Đã cập nhật thành công';
             //  res.redirect('/product');
      } catch (error) {
          msg = 'Lỗi '+ error.message;
          console.log(error);
      }
  }
 // res.render('products/edit-san-pham',{msg: msg, objSP: objSP, listTL:listTL});
}

exports.delete=async (req,res,next)=>{
  let msg = '';
  let idsp = req.params.idsp;
  let objSP = await (myMD.productModel.findById(idsp));
  let listTL = await (myMD.categoryModel.find());
  if(req.method=='POST'){
    let objSP= new myMD.productModel();
    objSP.name = req.body.name;
    objSP.price = req.body.price;
    objSP.id_theloai = req.body.id_theloai;
    objSP.image=req.body.image;
    objSP._id=idsp;
    try{
      await (myMD.productModel.findByIdAndDelete(idsp, objSP));
      msg = 'Đã xóa thành công';
      //res.redirect('/product');
    }catch (error) {
      msg = 'Lỗi '+ error.message;
      console.log(error);
  }
  }
  
 // res.render('products/xoa-san-pham',{msg:msg,objSP:objSP,listTL:listTL})
}

exports.show=async (req,res,next)=>{
  let msg = '';
  let idsp = req.params.idsp;
  let objSP = await (myMD.productModel.findById(idsp).populate('id_theloai'));
  let listTL = await (myMD.categoryModel.find());
  if(req.method=='POST'){
    let objSP= new myMD.productModel();
    objSP.name = req.body.name;
    objSP.price = req.body.price;
    objSP.id_theloai = req.body.id_theloai;
    objSP.image=req.body.image;
    objSP._id=idsp;
    
  }
  
 // res.render('products/chi-tiet',{msg:msg,objSP:objSP,listTL:listTL})
}
