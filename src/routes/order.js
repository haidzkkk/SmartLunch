var express = require ("express")
var  routerController =  require ("../controllers/order.js")


var routerOrder = express.Router();


routerOrder.post("/order", routerController.createOrder);
routerOrder.get("/order/:id", routerController.getOrderById)
routerOrder.delete("/order/:id", routerController.removeOrder);
routerOrder.get("/order/:userId/user", routerController.getOrderByUserId);
routerOrder.get("/getAllorder", routerController.getAllOrder)
routerOrder.patch("/order/:id", routerController.updateOrder);

module.exports = routerOrder;