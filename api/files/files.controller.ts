import { sendInternalError, sendSuccess } from "../../helpers/responses";
import { saveFiles } from "../../helpers/utils";
import { sendFiles } from "../../helpers/utils";

export class FilesController {
  async uploadFiles(req: any, res: any) {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("1. Received files from FE", req.files);
    const files = req.files as Express.Multer.File[];

    try {
      // save these files to the uploads folder
      // then send files to uploadthing
      if (!(await saveFiles(files))) {
        return res.status(400).json({ message: "No files uploaded" });
      } else {
        try {
          const filePaths = files.map(
            (file) => `./uploads/${file.originalname}`
          );
          const response = await sendFiles(filePaths);
          //   res.json({ message: "sendFiles: Data Received", response });
          sendSuccess(res, { data: response });
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
}
