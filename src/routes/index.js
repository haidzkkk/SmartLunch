var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
  // Gọi API để lấy dữ liệu
  const response = await fetch('http://localhost:3000/api/size');

  // Xử lý dữ liệu trả về từ API
  const data = await response.json();

  // Hiển thị dữ liệu lên HTML
  res.render('size/size', { data });
});
router.get('/index/:id', async (req, res) => {
  const response = await fetch('http://localhost:3000/api/size/'+req.params.id);

  // Xử lý dữ liệu trả về từ API
  const dataindex = await response.json();
  res.render('size/sizeindex', { dataindex });
});
module.exports = router;
