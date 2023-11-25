var express = require ("express")
var  routerController =  require ("../controllers/order.js")

const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate

var routerOrder = express.Router();

routerOrder.post("/order", authenticate,routerController.createOrder);
routerOrder.get("/order/:id",authenticate, routerController.getOrderById)
routerOrder.delete("/order/:id",authenticate, routerController.removeOrder);
routerOrder.get("/order/:userId/user",authenticate, routerController.getOrderByUserId);
routerOrder.get("/getAllorder",authenticate, routerController.getAllOrder)
routerOrder.patch("/order/:id",authenticate, routerController.updateOrder);
routerOrder.get("/getAllorderUi",authenticate,routerController.getAllOrderUI)
routerOrder.get("/getByIdOder/:id",authenticate,routerController.getbyIdOrderUI)
routerOrder.patch('/updateIsPayment/:orderId', routerController.updateIsPayment);
routerOrder.post("/order", authenticate, routerController.createOrder);
routerOrder.get("/order/:id", authenticate, routerController.getOrderById)
routerOrder.delete("/order/:id", authenticate, authorization, routerController.removeOrder);
routerOrder.get("/userId/order", authenticate, routerController.getOrderByUserId);
routerOrder.get("/getAllorder",  routerController.getAllOrder)
routerOrder.patch("/order/:id",  routerController.updateOrder);
routerOrder.patch("/order/payment/:id", authenticate, routerController.updatePaymentOrder);
routerOrder.get("/orders/delivering",authenticate, routerController.getOrderByShipper)
routerOrder.get("/orders/delivering/:id", routerController.getOrderByShipperId)
routerOrder.get("/getAllorderUi",routerController.getAllOrderUI)
routerOrder.get("/getByIdOder2/:id",authenticate,routerController.getbyIdOrderUI2)
routerOrder.get("/admin/oder_shipper/:id",routerController.getOderbyshipperUI)


module.exports = routerOrder;