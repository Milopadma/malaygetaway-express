import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { MerchantData, MerchantStatus } from "../types";

const merchantSchema = new Schema<MerchantData>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(MerchantStatus) },
});

const merchantModel = model<MerchantData>("Merchant", merchantSchema);

export default merchantModel;
