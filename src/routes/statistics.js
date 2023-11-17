var express = require('express');
var statisticsController = require('../controllers/statistics');
var router = express.Router();

  router.get('/admin/statistics', statisticsController.getStatistics);
  router.get('/chartuser', statisticsController.getUser);
  router.get('/chartorder', statisticsController.getOrderbyMonth);
  router.get('/sortedbyview', statisticsController.getSortedbyview);
  router.get("/getorder",  statisticsController.getOrderbyadmin)
  router.get("/getorderpie",  statisticsController.getOrderPie)
  router.get("/linegraph",  statisticsController.getLinegraph)
module.exports = router;