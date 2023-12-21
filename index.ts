import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import { UTApi } from "uploadthing/server";
import { checkConnection } from "./mongoDB/connection";

// Mylo
import MerchantRouter from "./api/merchant/merchant.routes";
import AuthRouter from "./api/auth/auth.routes";

// Adit
import PersonalDetailRouter from "./api/purchase/personalDetail/personalDetail.routes";
import BillingAddressRouter from "./api/purchase/billingAddress/billingAddress.routes";
import FilesRouter from "./api/files/files.routes";

const app = express();
dotenv.config();

app.use(function (
  req: any,
  res: { header: (arg0: string, arg1: string) => void },
  next: () => void
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const corsOption = {
  origin: "*",
};
app.use(cors(corsOption));
app.use(express.json());

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT secret not found");
  process.exit(1);
}

// this was causing crashes
// app.use(
//   session({
//     secret: String(process.env.SESSION_SECRET),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set secure to true for HTTPS
//   })
// );

app.use(express.urlencoded({ extended: false }));

// mongodb connection
checkConnection();

// external provider for file hosting
if (!process.env.UPLOADTHING_SECRET) {
  console.error("Uploadthing secret not found");
  process.exit(1);
}
export const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
});
if (utapi) {
  console.log("📁 UTApi Connected ✅");
} else {
  console.error("UTApi connection error");
}

// app.get("/", (req: any, res: { redirect: (arg0: string) => void }) => {
//   res.redirect("http://localhost:3003");
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mylo's endpoints
app.use("/api/auth", AuthRouter);
app.use("/api/merchant", MerchantRouter);
app.use("/api/files", FilesRouter);

// Adit's endpoints
app.use("/api/purchase/personalDetail", PersonalDetailRouter);
app.use("/api/purchase/billingAddress", BillingAddressRouter);

// Test Server Running
const port = process.env.PORT || 8080;
if (!port) {
  console.error("Port not found");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`🚀 Server Is Running On Port ${port}🚀`);
});
