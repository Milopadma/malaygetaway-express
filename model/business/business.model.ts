import { model } from "mongoose";
import { Schema } from "mongoose";
import { Business } from "../../types";

const businessSchema = new Schema<Business>({
  businessId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactEmail: { type: String, required: true },
});

const businessModel = model<Business>("Business", businessSchema);

export default businessModel;
