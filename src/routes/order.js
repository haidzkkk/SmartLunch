var express = require ("express")
var  routerController =  require ("../controllers/order.js")

const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate



var routerOrder = express.Router();

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
routerOrder.get("/getByIdOder/:id",routerController.getbyIdOrderUI)
routerOrder.get("/admin/oder_shipper/:id",routerController.getOderbyshipperUI)


module.exports = routerOrder;