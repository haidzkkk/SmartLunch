var express = require('express');
var router = express.Router();

router.get('/admin', (req, res) => {
  res.render("authtification/login");
  
});

module.exports = router;
