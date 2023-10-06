var express = ("express")
var createSize, getSize, getSizeById, removeSize, updateSize = ("../controllers/size.js")

const routerSize = express.Router();

routerSize.get("/size", getSize);
routerSize.get("/size/:id", getSizeById);
routerSize.delete("/size/:id", removeSize);
routerSize.post("/size", createSize);
routerSize.patch("/size/:id", updateSize);


export default routerSize;