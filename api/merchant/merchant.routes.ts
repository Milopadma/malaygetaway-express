import Express from "express";
import { MerchantController } from "./merchant.controller";

const controller = new MerchantController();
const MerchantRouter = Express.Router();

MerchantRouter.post("/register", controller.newMerchant);
MerchantRouter.get("/get", controller.getMerchants);
MerchantRouter.get("/get/:merchantId", controller.getMerchantById);
MerchantRouter.post("/update/:merchantId", controller.updateMerchantData);
MerchantRouter.post("/setStatus/:merchantId", controller.setMerchantStatus);

// checks
MerchantRouter.get("/check/name/:name", controller.checkMerchantName);
MerchantRouter.get("/check/email/:email", controller.checkEmail);
MerchantRouter.get(
  "/check/contactNumber/:contactNumber",
  controller.checkNumber
);

// products
MerchantRouter.get("/getProducts/:merchantId", controller.getProducts);
MerchantRouter.get("/getSingleProduct/:productId", controller.getSingleProduct);
MerchantRouter.post("/addProduct", controller.addProduct);
MerchantRouter.patch("/updateProduct/:productId", controller.updateProduct);
MerchantRouter.delete("/deleteProduct/:productId", controller.deleteProduct);

export default MerchantRouter;
