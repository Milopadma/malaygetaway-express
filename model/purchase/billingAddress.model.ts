import mongoose from "mongoose";

const billingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "DUMAI", required: true },
  country: { type: String, default: "USA" },
  postalCode: { type: String, required: true },
});

export default mongoose.model("billingAddress", billingAddressSchema);
