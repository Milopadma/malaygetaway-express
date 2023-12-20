import Express from "express";
import { FilesController } from "./files.controller";
import multer from "multer";

const controller = new FilesController();
const FilesRouter = Express.Router();
const upload = multer();

FilesRouter.post(
  "/upload/files",
  upload.array("files"),
  controller.uploadFiles
);

export default FilesRouter;
