import express, { Request, Response } from "express";
import cors from "cors";
import { Merchant, Business } from "./types"; // Import your types
import mongoose from "mongoose";
import { Resend } from "resend";
import { UTApi } from "uploadthing/server";
import multer from "multer";
import fs from "fs";
import { constants } from "fs";

// setup
const app = express();
app.use(cors());
app.use(express.json());
const db = process.env.MONGODB_URI as string;
if (!db) {
  console.error("Mongo URI not found");
  process.exit(1);
}
mongoose
  .connect("" + process.env.MONGODB_URI, { connectTimeoutMS: 1000 })
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
  const merchant: Merchant = JSON.parse(req.body.merchant);
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
  await saveFiles(files);

  // then send files to uploadthing
  if (await checkFiles(files)) {
    return res.status(400).json({ message: "No files uploaded" });
  } else {
    const formData = new FormData();
    files.forEach((file) => {
      const filePath = `./uploads/${file.originalname}`;
      fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        const blob = new Blob([data], { type: file.mimetype });
        formData.append("files", blob, file.originalname);
      });
    });

    console.log("4. Form data to send: ", formData);

    try {
      const response = await sendFiles(formData);
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

async function sendFiles(formData: FormData) {
  const files = formData.getAll("files");
  console.log("5. Sending...", files);
  const response = await utapi.uploadFiles(files);
  console.log(response);
}

// check if files exist by filename
async function checkFiles(files: Express.Multer.File[]): Promise<boolean> {
  console.log("3. Checking files...");
  for (const file of files) {
    const filePath = `./uploads/${file.originalname}`;
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      console.error(`${filePath} is not a complete file.`);
      return false;
    }
  }
  return true;
}

async function saveFiles(files: Express.Multer.File[]): Promise<void> {
  console.log("2. Saving files...");
  await files.forEach((file) => {
    const filePath = `./uploads/${file.originalname}`;
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) throw err;
      console.log("File saved in server!");
    });
  });
}
