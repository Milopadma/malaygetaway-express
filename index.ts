// import express, { Request, Response } from "express";
// import cors from "cors";
// import { MerchantData, Business } from "./types";
// import mongoose from "mongoose";
// import { Resend } from "resend";
// import multer from "multer";
// import fs from "fs";
// import dotenv from "dotenv";

// const upload = multer();

// // schema def
// const merchantSchema = new mongoose.Schema({
//   id: Number,
//   username: String,
//   password: String,
//   phoneNumber: Number,
//   email: String,
// });

// const businessSchema = new mongoose.Schema({
//   id: Number,
//   name: String,
//   description: String,
//   address: String,
//   contactNumber: String,
//   contactEmail: String,
// });

// const Merchant = mongoose.model("Merchant", merchantSchema);
// const Business = mongoose.model("Business", businessSchema);

// // ----------------------------------------------------------------------

// // send files endpoint
// app.post("/sendFiles", upload.array("files"), async (req, res) => {
//   if (!req.files) {
//     return res.status(400).json({ message: "No files uploaded" });
//   }

//   console.log("1. Received files from FE", req.files);
//   const files = req.files as Express.Multer.File[];

//   // save these files to the uploads folder
//   // then send files to uploadthing
//   if (!(await saveFiles(files))) {
//     return res.status(400).json({ message: "No files uploaded" });
//   } else {
//     try {
//       const filePaths = files.map((file) => `./uploads/${file.originalname}`);
//       const response = await sendFiles(filePaths);
//       res.json({ message: "sendFiles: Data Received", response });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error sending files" });
//     }
//   }
// });

// // ----------------------------------------------------------------------

// app.listen(3000, () => {
//   console.log(`Example app listening on port 3000`);
// });

// // ----------------------------------------------------------------------
// // functions
