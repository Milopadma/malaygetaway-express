import { Resend } from "resend";
import { readFile } from "fs/promises";
import fs from "fs";
import userModel from "~/model/users/user.model";
import { utapi } from "~/index";

export function checkKeys() {
  if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT secret not found!");
    process.exit(1);
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND Secret key not found!");
    process.exit(1);
  }
  // external provider for file hosting
  if (!process.env.UPLOADTHING_SECRET) {
    console.error("Uploadthing secret not found");
    process.exit(1);
  }
  if (utapi) {
    console.log("📁 UTApi Connected ✅");
  } else {
    console.error("UTApi connection error");
  }
}
// ----------------------------------------------------------------------
// email related functions
export function sendEmail(email: string, subject: string, html: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.emails.send({
    from: "no-reply@milopadma.com",
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
  contactNumber: number
): Promise<number | null> {
  const isPhoneNumberExist = await userModel.findOne({
    "data.type": "merchant",
    "data.data.contactNumber": contactNumber,
  });
  if (isPhoneNumberExist) {
    return null;
  }
  console.log("Validated phone number.");
  return contactNumber;
}

// ----------------------------------------------------------------------
// files related functions
export async function sendFiles(files: string[]): Promise<any[]> {
  // Map each file to a promise
  const promises = files.map(async (file) => {
    console.log("4. Reading file...", file);
    // read file
    const fileData = await Bun.file(file);
    console.log("4a. File read!", fileData.type);
    const response = await utapi.uploadFiles(fileData);
    console.log("5. Sending...");
    console.log("6. Files sent to utapi!", response);
    // purge local cache of files
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    return response;
  });

  // Wait for all promises to resolve
  const responses = await Promise.all(promises);

  return responses;
}

export async function saveFiles(files: any): Promise<boolean> {
  console.log("2. Saving files...");

  // check if uploads folder exists
  if (!fs.existsSync("./uploads")) {
    console.log("2a. Creating uploads folder...");
    fs.mkdirSync("./uploads");
  }

  // check if file already exists
  const filesInDir = fs.readdirSync("./uploads");
  files.forEach((file: { originalname: string }) => {
    if (filesInDir.includes(file.originalname)) {
      console.error(`${file.originalname} already exists in uploads folder.`);
      // early return
      return true;
    }
  });

  // save new files
  files.forEach(
    (file: { originalname: any; buffer: string | NodeJS.ArrayBufferView }) => {
      const filePath = `./uploads/${file.originalname}`;
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) throw err;
        console.log("2b. File saved in server!");
      });
    }
  );
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
