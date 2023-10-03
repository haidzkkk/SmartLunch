var express = require('express');
var messageController = require('../controllers/message')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get('/message/:id', messageController.getMessageById);
router.get('/message', messageController.getMessage);
router.post('/message', messageController.postMessage);
router.put('/message/:id', messageController.updateMessage);
router.delete('/message/:id', messageController.deleteMessage);


module.exports = router;