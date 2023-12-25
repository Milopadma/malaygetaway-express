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
import PayPalRouter from "./api/purchase/paymentMethod/payPal/payPal.routes";
import FormReviewRouter from "./api/review/formReview.routes";
import { checkKeys, sendFiles } from "./helpers/utils";
import formidable from "formidable";
import path from "path";
import { FilesController } from "./api/files/files.controller";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
export const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
});
// key checks
checkKeys();
// mongodb connection
checkConnection();

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
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Include 'OPTIONS'
  credentials: true,
};
app.use(express.urlencoded({ extended: false }));

// Enable pre-flight across the board
app.options("*", cors(corsOption));

// Logging Middleware for Debugging
app.use(express.json());
app.use((req, res, next) => {
  const section = req.url.split("/")[3];
  console.log("\n--- LOG START ---");
  console.log(`Section : ${section}`);
  console.log(`Time    : ${new Date().toLocaleString()}`);
  console.log(`Method  : ${req.method}`);
  console.log(`URL     : ${req.url}`);

  // Cetak isi body request untuk metode POST, PUT, dan PATCH
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    console.log(`Body    : ${JSON.stringify(req.body, null, 2)}`);
  }
  console.log(`Body    : ${JSON.stringify(req.body)}`);
  console.log("---- LOG END ----\n");
  next();
});

app.get("/api/hello", (req, res) => {
  res.send("Hello World!");
});

// Mylo's endpoints
app.use("/api/auth", AuthRouter);
app.use("/api/merchant", MerchantRouter);
// ---------------------------------------------------------------
const fc = new FilesController();

declare global {
  namespace Express {
    interface Request {
      filePaths?: string[];
    }
  }
}

app.post(
  "/api/files/upload",
  (req, res, next) => {
    const form = formidable({
      uploadDir: path.join(import.meta.dir, "uploads"),
      keepExtensions: true,
    });

    const filePaths: string[] = []; // Create an array to store file paths

    form.on("file", function (field, file) {
      // Push each file path into the array
      filePaths.push(file.filepath);
    });

    form.on("end", function () {
      req.filePaths = filePaths; // Attach the file paths to the req object
      next(); // call next() to move to the next middleware function
    });

    form.parse(req);
  },
  fc.sendFiles
);

// Adit
app.use("/api/purchase/personalDetail", PersonalDetailRouter);
app.use("/api/purchase/billingAddress", BillingAddressRouter);
app.use("/api/purchase/paymentMethod/payPal", PayPalRouter);
app.use("/api/review/formReview", FormReviewRouter);

// Test Server Running
const port = process.env.PORT || 8080;
if (!port) {
  console.error("Port not found");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`🚀 Server Is Running On Port ${port}🚀`);
});
