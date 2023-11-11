var express = require('express');
var router = express.Router();
router.get('/admin/statistics', (req, res) => {
    res.render("statistics/statistics");
  });
  router.get('/barchart', (req, res) => {
    res.render("statistics/bar");
  });
module.exports = router;