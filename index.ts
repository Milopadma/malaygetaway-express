import express, { Request, Response } from "express";
import cors from "cors";
import { Merchant, Business } from "./types"; // Import your types

const app = express();
app.use(cors());
app.use(express.json());

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
  res.json({ message: "Merchant/register: Data Received" });
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
