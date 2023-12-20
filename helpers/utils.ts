import { Resend } from "resend";
import { readFile } from "fs/promises";
import fs from "fs";
import { utapi } from "~/server";

// ----------------------------------------------------------------------
// email related functions
export function sendEmail(email: string, subject: string, html: string) {
  const resend = new Resend("re_R8dVwJbN_Jz2neHkTJJaL3wkD6AC9dXUH");

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: subject,
    html: html,
  });

  console.log("Email sent!");
}

// ----------------------------------------------------------------------
// files related functions
export async function sendFiles(files: string[]): Promise<any> {
  files.forEach(async (file) => {
    const responses = await utapi.uploadFiles(Bun.file(file));
    console.log("5. Sending...");
    console.log("6. Files sent!", responses);
  });
  // purge local cache of files
  files.forEach((file) => {
    fs.unlinkSync(file);
  });
  return true;
}

export async function saveFiles(
  files: Express.Multer.File[]
): Promise<boolean> {
  console.log("2. Saving files...");

  // check if uploads folder exists
  if (!fs.existsSync("./uploads")) {
    console.log("2a. Creating uploads folder...");
    fs.mkdirSync("./uploads");
  }

  // check if file already exists
  const filesInDir = fs.readdirSync("./uploads");
  files.forEach((file) => {
    if (filesInDir.includes(file.originalname)) {
      console.error(`${file.originalname} already exists in uploads folder.`);
      // early return
      return true;
    }
  });

  // save new files
  files.forEach((file) => {
    const filePath = `./uploads/${file.originalname}`;
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) throw err;
      console.log("2b. File saved in server!");
    });
  });
  // wait for files to be saved
  await new Promise((resolve) => setTimeout(resolve, 10));

  // validate files
  console.log("3. Checking files...");
  try {
    for (const file of files) {
      const filePath = `./uploads/${file.originalname}`;
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        console.error(`${filePath} is not a complete file.`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function fileread(filename: string) {
  const file = await readFile(filename, "utf8");
}
