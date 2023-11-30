var express = require('express');
var messageController = require('../controllers/message')
var authenticate = require('../middlewares/authenticate').authenticate
var upload = require('../config/configApp').upload

var router = express.Router();

router.get('/message/:id', authenticate, messageController.getMessageById);
router.get('/message/call/:id', authenticate, messageController.getLastMessageCall);
router.get('/message', authenticate, messageController.getMessage);
router.post('/message', authenticate, upload.array("images", 10), messageController.postMessage);
router.post('/message/call', authenticate, messageController.postMessageCall);
router.put('/message/:id', authenticate, messageController.updateMessage);
router.delete('/message/:id', authenticate, messageController.deleteMessage);


module.exports = router;