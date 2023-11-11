var express = require ("express")
var  routerController =  require ("../controllers/order.js")
var { authenticate } = require('../middlewares/authenticate')
var { authorization } = require('../middlewares/authorization.js')


var routerOrder = express.Router();

routerOrder.post("/order", authenticate, routerController.createOrder);
routerOrder.get("/order/:id", authenticate, routerController.getOrderById)
routerOrder.delete("/order/:id", authenticate, authorization, routerController.removeOrder);
routerOrder.get("/userId/order", authenticate, routerController.getOrderByUserId);
routerOrder.get("/getAllorder", authenticate, routerController.getAllOrder)
routerOrder.patch("/order", authenticate, routerController.updateOrder);
routerOrder.patch("/order/payment/:id", authenticate, routerController.updatePaymentOrder);
routerOrder.get("/orders/delivering",authenticate, routerController.getOrderByShipper)

routerOrder.get("/getAllorderUi", routerController.getAllOrderUI)
routerOrder.get("/getByIdOder/:id", routerController.getbyIdOrderUI)

module.exports = routerOrder;