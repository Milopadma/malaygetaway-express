import Express from "express";
import { CustomerController } from "./customer.controller";

const controller = new CustomerController();
const CustomerRouter = Express.Router();

CustomerRouter.get("/getProducts", controller.getProducts);
CustomerRouter.get("/getProduct/:productId", controller.getProduct);

export default CustomerRouter;
