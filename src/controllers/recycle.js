const fetch = require('node-fetch');

exports.getProductDelete = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/products/delete');
    const data = await response.json();
    res.render('recyclebin/recycle', { data,layout :"Layouts/home" });
  };
  
exports.getCategoryDelete = async (req, res) => {
  const response = await fetch('http://localhost:3000/api/category/delete');
  const datacategory = await response.json();
  res.render('recyclebin/recycle_category', { datacategory,layout :"Layouts/home" });
};