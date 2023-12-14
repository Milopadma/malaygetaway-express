import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { checkConnection } from "./mongoDB/connection";
import PersonalDetailRouter from "./api/personalDetail/personalDetail.routes";
import MerchantRouter from "./api/merchant/merchant.routes";

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
app.use(express.urlencoded({ extended: false }));

checkConnection();

app.get("/", (req: any, res: { redirect: (arg0: string) => void }) => {
  res.redirect("http://localhost:3003");
});

app.use("/api/personalDetail", PersonalDetailRouter);
app.use("/api/merchant", MerchantRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Server Is Running On Port ${PORT}🚀`);
});
