import Express from "express";
import { PersonalDetailController } from "./personalDetail.controller";

const controller = new PersonalDetailController();

const PersonalDetailRouter = Express.Router();

PersonalDetailRouter.get("/get", controller.getPersonalDetail);
PersonalDetailRouter.get("/get/:id", controller.getPersonalDetailById);
PersonalDetailRouter.post("/create", controller.createPersonalDetail);
PersonalDetailRouter.put("/update/:id", controller.updatePersonalDetail);
PersonalDetailRouter.delete("/delete/:id", controller.deletePersonalDetail);

export default PersonalDetailRouter;
