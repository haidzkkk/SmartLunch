var express = require('express')
var notificationController = require('../controllers/notification')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get("/notification",authenticate, notificationController.notifications);
router.get("/notification/read/:id",authenticate, notificationController.readNotification);

module.exports = router;