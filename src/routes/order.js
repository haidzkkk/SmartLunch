var express = require ("express")
var  routerController =  require ("../controllers/order.js")

const authorization  = require('../middlewares/authorization').authorization;
const authenticate = require('../middlewares/authenticate').authenticate



routerOrder.post("/order", authenticate,routerController.createOrder);
routerOrder.get("/order/:id",authenticate, routerController.getOrderById)
routerOrder.delete("/order/:id",authenticate, routerController.removeOrder);
routerOrder.get("/order/:userId/user",authenticate, routerController.getOrderByUserId);
routerOrder.get("/getAllorder",authenticate, routerController.getAllOrder)
routerOrder.patch("/order/:id",authenticate, routerController.updateOrder);
routerOrder.get("/getAllorderUi",authenticate,routerController.getAllOrderUI)
routerOrder.get("/getByIdOder/:id",authenticate,routerController.getbyIdOrderUI)


module.exports = routerOrder;