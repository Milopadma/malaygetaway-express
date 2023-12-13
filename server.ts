import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { checkConnection } from "./mongoDB/connection";

const app = express();
dotenv.config();

const { personalDetail } = require("./api/index");
const personalDetailRoute = require("./api/personalDetail/personalDetail.routes");
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

app.use("/api/personalDetail", personalDetail.personalDetailRoute);
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Server Is Running On Port ${PORT}🚀`);
});
