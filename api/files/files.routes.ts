import Express from "express";
import { FilesController } from "./files.controller";
import multer from "multer";

const controller = new FilesController();
const FilesRouter = Express.Router();
const upload = multer();

FilesRouter.post(
  "/upload/multiple",
  upload.array("files"),
  controller.uploadFiles
);

FilesRouter.post("/upload/test", controller.testUpload);

export default FilesRouter;
