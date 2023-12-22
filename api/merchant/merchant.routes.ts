import Express from "express";
import { MerchantController } from "./merchant.controller";

const controller = new MerchantController();
const MerchantRouter = Express.Router();

MerchantRouter.post("/register", controller.newMerchant);
MerchantRouter.get("/get", controller.getMerchants);
MerchantRouter.get("/get/:merchantId", controller.getMerchantById);
MerchantRouter.post("/update/:merchantId", controller.updateMerchantData);
MerchantRouter.post("/setStatus/:merchantId", controller.setMerchantStatus);

export default MerchantRouter;
