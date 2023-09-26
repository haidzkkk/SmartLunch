var express = require('express');
var authController = require('../controllers/auth')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.post('/login', authController.login);
router.get('/auth',authenticate, authController.getAuth);
router.post('/auth', authController.addAuth);
router.put('/auth/:id', authController.updateAuth);
router.delete('/auth/:id', authController.deleteAuth);

module.exports = router;
