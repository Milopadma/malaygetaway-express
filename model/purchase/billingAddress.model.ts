import mongoose from "mongoose";

const billingAddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "DUMAI", required: true },
  country: { type: String, default: "USA" },
  postalCode: { type: String, required: true },
});

export default mongoose.model("BillingAddress", billingAddressSchema);
