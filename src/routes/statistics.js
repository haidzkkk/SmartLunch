var express = require('express');
var statisticsController = require('../controllers/statistics');
var router = express.Router();

  router.get('/admin/statistics', statisticsController.getStatistics);
  router.get('/chartuser', statisticsController.getUser);
  router.get('/chartorder', statisticsController.getOrderbyMonth);
  router.get('/sortedbyview', statisticsController.getSortedbyview);
  router.get("/getorder",  statisticsController.getOrderbyadmin)
  router.get("/getorderCancel",  statisticsController.getOrderCancelbyadmin)
  router.get("/getorderSum",  statisticsController.getOrderSum)
  router.get("/getorderpie",  statisticsController.getOrderPie)
  router.get("/linegraph",  statisticsController.getLinegraph)
  router.get("/linegraph2",  statisticsController.getLinegraph2)
  router.get("/getproductsorted",  statisticsController.getProduct)
  router.get("/sortedbybough",  statisticsController.getSortedbybought)
module.exports = router;