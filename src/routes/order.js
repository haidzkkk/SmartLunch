var express = require ("express")
var  routerController =  require ("../controllers/order.js");
const authenticate = require('../middlewares/authenticate').authenticate;


var routerOrder = express.Router();


routerOrder.post("/order", routerController.createOrder);
routerOrder.get("/order/:id", routerController.getOrderById)
routerOrder.delete("/order/:id", routerController.removeOrder);
routerOrder.get("/order/:userId/user", routerController.getOrderByUserId);
routerOrder.get("/orders/delivering",authenticate, routerController.getOrderByShipper);
routerOrder.get("/getAllorder", routerController.getAllOrder)
routerOrder.patch("/order/:id", routerController.updateOrder);

routerOrder.get("/getAllorderUi", routerController.getAllOrderUI)
routerOrder.get("/getByIdOder/:id", routerController.getbyIdOrderUI)

module.exports = routerOrder;