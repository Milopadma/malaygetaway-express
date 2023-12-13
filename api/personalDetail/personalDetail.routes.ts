import Express from "express";
import { PersonalDetailController } from "./personalDetail.controller";

const controller = new PersonalDetailController();

const router = Express.Router();

router.get("/get", controller.getPersonalDetail);
router.get("/get/:id", controller.getPersonalDetailById);
router.post("/create", controller.createPersonalDetail);
router.put("/update/:id", controller.updatePersonalDetail);
router.delete("/delete/:id", controller.deletePersonalDetail);

module.exports = router;
