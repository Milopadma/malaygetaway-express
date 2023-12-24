import Express from "express";
import { FilesController } from "./files.controller";
import { validateFormData } from "./files.middleware";

const controller = new FilesController();
const FilesRouter = Express.Router();

// FilesRouter.post("/upload/multiple", validateFormData, controller.uploadFiles);

// FilesRouter.post("/upload/test", controller.testUpload);

export default FilesRouter;
