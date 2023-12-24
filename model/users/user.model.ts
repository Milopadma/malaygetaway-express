import { SchemaDefinition, model } from "mongoose";
import mongoose from "mongoose";
import {
  CustomerData,
  MerchantData,
  MinistryOfficerData,
  User,
  UserType,
} from "../../types";

const options = { discriminatorKey: "type" };

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  options
);

const userModel = mongoose.model("User", userSchema);

const merchantSchema = new mongoose.Schema({
  merchantId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  contactEmail: { type: String, required: true },
  description: { type: String, required: true },
  businessFileURLs: { type: [String], required: true },
  status: { type: String, required: true },
});

const customerSchema = new mongoose.Schema({
  customerId: { type: Number, required: true, unique: true },
});

const officerSchema = new mongoose.Schema({
  officerId: { type: Number, required: true, unique: true },
});

userModel.discriminator(UserType.MERCHANT, merchantSchema);
userModel.discriminator(UserType.CUSTOMER, customerSchema);
userModel.discriminator(UserType.MINISTRY_OFFICER, officerSchema);

export default userModel;
