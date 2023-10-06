var express = ('express')
var { createCoupons, getAllCoupons, getOneCoupons, removeCoupons, updateCoupons } = ('../controllers/coupons.js')

const routerCoupons = express.Router();

routerCoupons.post("/coupons", createCoupons);
routerCoupons.get("/coupons", getAllCoupons);
routerCoupons.get("/coupons/:id", getOneCoupons);
routerCoupons.delete("/coupons/:id", removeCoupons);
routerCoupons.patch("/coupons/:id", updateCoupons);


export default routerCoupons;