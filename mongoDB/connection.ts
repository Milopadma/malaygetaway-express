import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGO_URI;

export async function checkConnection() {
  if (!url) {
    console.error("Mongo URI not found");
    process.exit(1);
  }
  try {
    await mongoose.connect(url);
    console.log("✅ Successfully Connected To MongoDB✅");
  } catch (error) {
    console.error("!!! Connection Error", error);
  }
}
