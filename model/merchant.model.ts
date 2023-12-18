import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { Merchant, MerchantStatus } from "../types";

const merchantSchema = new Schema<Merchant>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(MerchantStatus) },
});

const merchantModel = model<Merchant>("Merchant", merchantSchema);

export default merchantModel;
