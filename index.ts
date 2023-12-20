import express, { Request, Response } from "express";
import cors from "cors";
import { MerchantData, Business } from "./types"; 
import mongoose from "mongoose";
import { Resend } from "resend";
import { UTApi } from "uploadthing/server";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";

// setup
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = process.env.MONGO_URI;
console.log(db);

if (!db) {
  console.error("Mongo URI not found");
  process.exit(1);
}
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
});

if (!process.env.UPLOADTHING_SECRET) {
  console.error("Uploadthing secret not found");
  process.exit(1);
}

if (utapi) {
  console.log("UTApi connected");
}

const upload = multer();

// schema def
const merchantSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  phoneNumber: Number,
  email: String,
});

const businessSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  address: String,
  contactNumber: String,
  contactEmail: String,
});

const Merchant = mongoose.model("Merchant", merchantSchema);
const Business = mongoose.model("Business", businessSchema);

// ----------------------------------------------------------------------

// login endpoint
app.post("/login", (req: Request, res: Response) => {
  console.log(req.body);
  res.json({ message: "Login: Data Received" });
});

// merchant register endpoint
app.post("/merchant/register", (req: Request, res: Response) => {
  const merchant: MerchantData = JSON.parse(req.body.merchant);
  const business: Business = JSON.parse(req.body.business);
  console.log(merchant);
  console.log(business);

  // Create and save a new merchant
  const newMerchant = new Merchant(merchant);
  newMerchant
    .save()
    .then((savedMerchant) => {
      console.log(savedMerchant.id);
    })
    .catch((err) => {
      console.error(err);
    });

  // Create and save a new business
  const newBusiness = new Business(business);
  newBusiness
    .save()
    .then((savedBusiness) => {
      console.log(savedBusiness.id);
    })
    .catch((err) => {
      console.error(err);
    });

  sendEmail();

  res.json({ message: "Merchant/register: Data Received" });
});

// send files endpoint
app.post("/sendFiles", upload.array("files"), async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  console.log("1. Received files from FE", req.files);
  const files = req.files as Express.Multer.File[];

  // save these files to the uploads folder
  // then send files to uploadthing
  if (!(await saveFiles(files))) {
    return res.status(400).json({ message: "No files uploaded" });
  } else {
    try {
      const filePaths = files.map((file) => `./uploads/${file.originalname}`);
      const response = await sendFiles(filePaths);
      res.json({ message: "sendFiles: Data Received", response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending files" });
    }
  }
});

// ----------------------------------------------------------------------

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});

// ----------------------------------------------------------------------
// functions
function sendEmail() {
  const resend = new Resend("re_R8dVwJbN_Jz2neHkTJJaL3wkD6AC9dXUH");

  const data = {
    name: "Milo",
  };

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: "milopadma@yahoo.com",
    subject: "Hello World",
    html: `<p>Congrats on sending your <strong>first email ${data.name}</strong>!</p>`,
  });

  console.log("sendEmail");
}

async function sendFiles(files: string[]) {
  files.forEach(async (file) => {
    const responses = await utapi.uploadFiles(readFile(file));
    console.log("5. Sending...");
    console.log("6. Files sent!", responses);
  });
  // purge local cache of files
  files.forEach((file) => {
    fs.unlinkSync(file);
  });
}

async function saveFiles(files: Express.Multer.File[]): Promise<boolean> {
  console.log("2. Saving files...");

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
      console.log("2a. File saved in server!");
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

function readFile(filename: string) {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
}
