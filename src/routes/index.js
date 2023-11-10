var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render("wc");
  
});
router.get('/calender', (req, res) => {
  res.render("layouts/calender");
  
});
router.get('/dashboard', (req, res) => {

  res.render("dashboard/dashboard",{layout :"Layouts/home" });
  
});
router.get('/chartpie', (req, res) => {

  res.render("dashboard/chartpie");
  
});
router.get('/linegraph', (req, res) => {

  res.render("dashboard/linegraph");
  
});
router.get('/popular', (req, res) => {

  res.render("dashboard/popular");
  
});


module.exports = router;
