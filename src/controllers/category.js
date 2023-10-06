var fs = require('fs');
var myMD= require('../models/category')
const {query}= require('express');

exports.list = async(req, res, next)=>{
  let dieu_kien_loc= null;
  // if(typeof(req.query.))
let list=await(myMD.productModel.find().populate('id_category'));
console.log(list);


//res.render('products/sanpham',{listSP:list});
}





exports.categoryAdd =  async(req,res,next)=>{
  //khai báo biến thông tin
  let msg = '';
  if(req.method =='POST'){
      // kiểm tra hợp lệ dữ liệu nếu có....
      // tạo model để gán dữ liệu
      let objSP = new myMD.categoryModel();
      objSP.name = req.body.name;
      // ghi vào CSDL
      try {
          let new_sp = await (objSP.save());
          console.log(new_sp);
          msg = 'Thêm mới thành công';
          //res.redirect('/the_loai');
      } catch (error) {
          msg = 'Lỗi '+ error.message;
          console.log(error);
      }
  }

 // res.render('products/add_theloai', {msg: msg});
}
exports.listCategory = async (req, res, next) => {
  try {
    let list = await myMD.categoryModel.find();
    console.log(list);
    //res.render('products/add_theloai', { listSP: list });
    
  } catch (error) {
    let msg = 'Lỗi ' + error.message;
    console.log(error);
    // Xử lý lỗi ở đây (ví dụ: ghi log, gửi email thông báo lỗi, trả về trang lỗi...)
    res.status(500).send(msg);
  }
}
exports.deleteCategory=async (req,res,next)=>{
  let msg = '';
  let idsp = req.params.idsp;
  let objSP = await (myMD.categoryModel.findById(idsp));
  if(req.method=='POST'){
    let objSP= new myMD.categoryModel();
    objSP.name = req.body.name;
    objSP._id=idsp;
    try{
      await (myMD.categoryModel.findByIdAndDelete(idsp, objSP));
      msg = 'Đã xóa thành công';
      //res.redirect('/the_loai');
    }catch (error) {
      msg = 'Lỗi '+ error.message;
      console.log(error);
  }
  }
 // res.render('products/xoa_the_loai',{msg:msg,objSP:objSP})
}

exports.editCategory = async (req,res,next)=>{
  let msg = '';
  let idsp = req.params.idsp;
  // lấy thông tin sản phẩm để sửa, tự thêm khối truy catch để bắt lỗi. 
  let objSP = await (myMD.categoryModel.findById(idsp));
  if(req.method =='POST'){
      // kiểm tra hợp lệ dữ liệu nếu có....
      // tạo model để gán dữ liệu
      let objSP = new myMD.categoryModel();
      objSP.name = req.body.name;;
      objSP._id = idsp;// thêm cho chức năng sửa
      // ghi vào CSDL
      try {
          // let new_sp = await objSP.save();
          // console.log(new_sp);
          // msg = 'Thêm mới thành công';
          await (myMD.categoryModel.findByIdAndUpdate(idsp, objSP));
          msg = 'Đã cập nhật thành công';
         // res.redirect('/the_loai');

      } catch (error) {
          msg = 'Lỗi '+ error.message;
          console.log(error);
      }
  } 
//  res.render('products/edit_the_loai',{msg: msg, objSP: objSP});
}

exports.editCategory = async (req,res,next) => {

  var listLoai = await myMD.categoryModel.find();
  let id = req.params.id;

  let dieu_kien_loc = {loaisp : id};

   var list = await myMD.categoryModel.find(dieu_kien_loc).populate('loaisp');

 // res.render('products/sanpham',{list : list , listLoai : listLoai} );

}