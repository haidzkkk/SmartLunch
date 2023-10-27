var express = require('express')
var  favouriteController = require('../controllers/favourite.js')
var authenticate = require('../middlewares/authenticate').authenticate

var router = express.Router();

router.get("/favourite",authenticate, favouriteController.favorites);
router.get("/favourite/:id",authenticate, favouriteController.findFavorite);
router.get("/favourite/product/:id",authenticate, favouriteController.findProductFavorite);
router.post("/favourite",authenticate, favouriteController.postFavorite);
router.delete("/favourite/:id",authenticate,  favouriteController.deleteFavorite);


module.exports = router;