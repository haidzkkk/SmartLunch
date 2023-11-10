const express = require('express');
const addressController = require('../controllers/address');
const authenticate = require('../middlewares/authenticate').authenticate;
const authorization = require('../middlewares/authorization').authorization;

const router = express.Router();

router.get('/addresses', addressController.getAll);
router.get('/user/addresses', authenticate, addressController.getAddressesByUserId);
router.get('/addresses/:id', authenticate, addressController.getOneById);
router.post('/addresses', authenticate, addressController.createAddress);
router.patch('/addresses/:id', authenticate, addressController.updateAddress);
router.delete('/addresses/:id', authenticate, addressController.removeAddress);

module.exports = router;
