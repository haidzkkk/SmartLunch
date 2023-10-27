var express = require('express');
var roomController = require('../controllers/room')
var authenticate = require('../middlewares/authenticate').authenticate
var authorization = require('../middlewares/authorization').authorization

var router = express.Router();

// router.post('/login', authController.login); 
router.get('/room', authenticate, roomController.getRoomById);
router.post('/room', authenticate, roomController.postRoom);
router.put('/room/:id', authenticate, roomController.updateRoom);
router.delete('/room/:id', authenticate, roomController.deleteRoom);


module.exports = router;