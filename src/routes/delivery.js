const express = require('express');
const deliveryOrderController = require('../controllers/delivery');
const authenticate = require('../middlewares/authenticate').authenticate;
var upload = require('../config/configApp').upload

const router = express.Router();

router.get('/deliveryOrder', authenticate, deliveryOrderController.getAllDeliveryOrders);
router.get('/deliveryOrder/:id', deliveryOrderController.getOneById);
router.post('/deliveryOrder', authenticate, upload.array("images", 1), deliveryOrderController.createDeliveryOrder);

module.exports = router;