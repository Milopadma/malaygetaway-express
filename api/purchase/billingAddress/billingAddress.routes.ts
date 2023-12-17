import Express from "express";
import { BillingAddressController } from "./billingAddress.controller";

const controller = new BillingAddressController();
const BillingAddressRouter = Express.Router();

BillingAddressRouter.get("/get", controller.getBillingAddress);
BillingAddressRouter.get("/get/:id", controller.getBillingAddressById);
BillingAddressRouter.post("/create", controller.createBillingAddress);
BillingAddressRouter.put("/update/:id", controller.updateBillingAddress);
BillingAddressRouter.delete("/delete/:id", controller.deleteBillingAddress);

export default BillingAddressRouter;
