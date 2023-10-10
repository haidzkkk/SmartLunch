var express = require('express');
var messageController = require('../controllers/message')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get('/message/:id', authenticate, messageController.getMessageById);
router.get('/message', authenticate, messageController.getMessage);
router.post('/message', authenticate, messageController.postMessage);
router.put('/message/:id', authenticate, messageController.updateMessage);
router.delete('/message/:id', authenticate, messageController.deleteMessage);


module.exports = router;