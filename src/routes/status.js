var express = require('express');
var statusController = require('../controllers/status')
var router = express.Router();


router.get('/status', statusController.status);
router.post('/status', statusController.addstatus);
router.delete('/status/:id', statusController.deletestatus);
router.put('/status/:id', statusController.updatestatus);

module.exports = router;