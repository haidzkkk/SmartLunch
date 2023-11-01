var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render("authtification/login");
  
});

module.exports = router;
