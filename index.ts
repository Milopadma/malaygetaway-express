import express, { Request, Response } from "express";
import cors from "cors";
import { Merchant, Business } from "./types"; // Import your types
import mongoose from "mongoose";

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
  .connect(db)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

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

  res.json({ message: "Merchant/register: Data Received" });
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
