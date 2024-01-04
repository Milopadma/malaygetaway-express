import { Request, Response, NextFunction } from "express";
import Busboy from "busboy";

declare global {
  namespace Express {
    interface Request {
      files?: any[];
    }
  }
}

export function validateFormData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bb = Busboy({ headers: req.headers });
  const files: any[] = []; // Array to store files

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log(
      `\nFile [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );

    const fileData: any = {
      name,
      filename,
      encoding,
      mimeType,
      data: [], // Array to store file data
    };

    file
      .on("data", (data) => {
        console.log(`File [${name}] got ${data.length} bytes`);
        fileData.data.push(data); // Push file data into the array
      })
      .on("end", () => {
        console.log(`File [${name}] done`);
        files.push(fileData); // Push file object into the files array
      });
  });
  bb.on("error", (error) => {
    console.error("Error parsing form data:", error);
  });
  bb.on("finish", () => {
    console.log("Done parsing form!");
    req.files = files;
    next();
  });

  req.pipe(bb);
}
