var express = require('express');
var statisticsController = require('../controllers/statistics');
var router = express.Router();

  router.get('/admin/statistics', statisticsController.getStatistics);
  router.get('/barchart', statisticsController.getUser);
module.exports = router;