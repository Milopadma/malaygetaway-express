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

const corsOption = {
  origin: 'http://localhost:54792', // URL frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Penting jika menggunakan cookies atau auth headers
};
app.use(cors(corsOption));
app.use(express.json());
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true for HTTPS
  })
);
app.use(express.urlencoded({ extended: false }));

checkConnection();

app.get("/", (req: any, res: { redirect: (arg0: string) => void }) => {
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

// Test Server Running
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Server Is Running On Port ${PORT}🚀`);
});
