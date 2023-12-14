import Express from "express";
import { MerchantController } from "./merchant.controller";

const controller = new MerchantController();
const MerchantRouter = Express.Router();

MerchantRouter.get("/get", controller.getMerchant);
MerchantRouter.get("/get/:id", controller.getMerchantById);
MerchantRouter.post("/create", controller.createMerchant);
MerchantRouter.put("/update/:id", controller.updateMerchant);
MerchantRouter.delete("/delete/:id", controller.deleteMerchant);

export default MerchantController;
