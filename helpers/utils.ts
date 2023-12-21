import { Resend } from "resend";
import { readFile } from "fs/promises";
import fs from "fs";
import { utapi } from "~/index";
import userModel from "~/model/users/user.model";

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

export function generateUsername(email: string): string {
  let username = "";
  let randomNumber = 0;
  do {
    username = email.split("@")[0];
    randomNumber = Math.floor(Math.random() * 100);
  } while (userModel.findOne({ username: username + randomNumber }));
  console.log("Generated username.", username + randomNumber);
  return `${username}${randomNumber}`;
}

export async function validateEmail(email: string): Promise<string | null> {
  if (!email.includes("@")) {
    throw new Error("Invalid email address.");
  } else {
    const isEmailExist = await userModel.findOne({
      "data.type": "merchant",
      "data.data.email": email,
    });
    if (isEmailExist) {
      return null;
    }
  }
  console.log("Validated email.");
  return email;
}

export async function validatePhoneNumber(
  phoneNumber: number
): Promise<number | null> {
  const isPhoneNumberExist = await userModel.findOne({
    "data.type": "merchant",
    "data.data.phoneNumber": phoneNumber,
  });
  if (isPhoneNumberExist) {
    return null;
  }
  console.log("Validated phone number.");
  return phoneNumber;
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

// ----------------------------------------------------------------------
// numberical related functions
export function generateUniqueId(): number {
  let id: number;
  do {
    id = Math.floor(100000 + Math.random() * 900000);
  } while (!userModel.findById(id));

  return id;
}
