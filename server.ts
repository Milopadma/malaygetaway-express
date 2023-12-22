import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { checkConnection } from "./mongoDB/connection";
import session from "express-session";

// Mylo
import MerchantRouter from "./api/merchant/merchant.routes";
import AuthRouter from "./api/auth/auth.routes";
// Adit
import PersonalDetailRouter from "./api/purchase/personalDetail/personalDetail.routes";
import BillingAddressRouter from "./api/purchase/billingAddress/billingAddress.routes";
import CreditCardRouter from "./api/purchase/paymentMethod/creditCard/creditCard.routes";
import PayPalRouter from "./api/purchase/paymentMethod/payPal/payPal.routes";
import FormReviewRouter from "./api/review/formReview.routes";

const app = express();
dotenv.config();

// CORS configuration
const corsOption = {
  origin: 'http://localhost:63418', // Adjust this to match your front-end URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include 'OPTIONS'
  credentials: true 
};
app.use(cors(corsOption));

// Enable pre-flight across the board
app.options('*', cors(corsOption)); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

checkConnection();

// Logging Middleware for Debugging
app.use((req, res, next) => {
  const section = req.url.split('/')[3];
  console.log("\n--- LOG START ---");
  console.log(`Section : ${section}`);
  console.log(`Time    : ${new Date().toLocaleString()}`);
  console.log(`Method  : ${req.method}`);
  console.log(`URL     : ${req.url}`);
  console.log("---- LOG END ----\n");

  next();
});

// Routes Setup
app.get("/", (req, res) => {
  res.redirect("http://localhost:3003");
});

// Mylo
app.use("/api/auth", AuthRouter);
app.use("/api/merchant", MerchantRouter);
// Adit
app.use("/api/purchase/personalDetail", PersonalDetailRouter);
app.use("/api/purchase/billingAddress", BillingAddressRouter);
app.use("/api/purchase/paymentMethod/creditCard", CreditCardRouter);
app.use("/api/purchase/paymentMethod/payPal", PayPalRouter);
app.use("/api/review/formReview", FormReviewRouter);

// Start Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Server Is Running On Port ${PORT} 🚀`);
});
