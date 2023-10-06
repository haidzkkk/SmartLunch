var express = require('express');
var roomController = require('../controllers/room')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

// router.post('/login', authController.login);
router.get('/room/:id', roomController.getRoomById);
router.get('/room', roomController.getRoom);
router.post('/room', roomController.postRoom);
router.put('/room/:id', roomController.updateRoom);
router.delete('/room/:id', roomController.deleteRoom);


module.exports = router;