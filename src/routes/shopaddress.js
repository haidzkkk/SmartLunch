const express = require('express');
const addressController = require('../controllers/shopaddress');

const router = express.Router();
router.get('/admin/shopaddress', addressController.getAddressUI);
router.get('/shopaddress', addressController.getAddress);
// router.post('/shopaddress', addressController.updateAddress);
router.post('/shopaddress', addressController.add);



module.exports = router;
