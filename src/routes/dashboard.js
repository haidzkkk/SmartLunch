var express = require('express');
var router = express.Router();
var dashboardController = require('../controllers/dashboard');
router.get('/', (req, res) => {
  res.render("authtification/login");
  
  
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
router.get("/sum", dashboardController.getSum);

module.exports = router;
