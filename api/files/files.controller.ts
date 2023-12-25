import { sendInternalError, sendSuccess } from "../../helpers/responses";
import { saveFiles } from "../../helpers/utils";
import { sendFiles } from "../../helpers/utils";

export class FilesController {
  async uploadFiles(req: any, res: any) {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("1. Received files from FE", req.files);
    const files = req.files;

    try {
      // save these files to the uploads folder
      // then send files to uploadthing
      if (!(await saveFiles(files))) {
        return res.status(400).json({ message: "No files uploaded" });
      } else {
        try {
          const filePaths = files.map(
            (file: { originalname: any }) => `./uploads/${file.originalname}`
          );
          const response = await sendFiles(filePaths);
          //   res.json({ message: "sendFiles: Data Received", response });
          //   sendSuccess(res, { data: response });
          console.log("6. Files sent!", response);
        } catch (error) {
          console.error(error);
          //   res.status(500).json({ message: "Error sending files" });
          sendInternalError(res, error);
        }
      }
      sendSuccess(res, { data: req.file });
    } catch (error) {
      console.log("error", error);
      sendInternalError(res, error);
    }
  }

  async sendFiles(req: any, res: any) {
    console.log("1. Received files from FE");
    try {
      const paths = req.filePaths;
      const data = await sendFiles(paths); // Wait for sendFiles to finish
      sendSuccess(res, { data });
    } catch (error) {
      console.error(error);
      sendInternalError(res, error);
    }
  }

  async testUpload(req: any, res: any) {
    try {
      const response = await sendFiles(["./uploads/gimmeasec.png"]);
      console.log("6. Files sent!", response);
      sendSuccess(res, { data: response });
    } catch (error) {
      console.error(error);
      sendInternalError(res, error);
    }
  }
}
