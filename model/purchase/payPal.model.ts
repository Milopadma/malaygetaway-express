import mongoose from "mongoose";

const payPalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'], // Validasi format email
  },
});

export default mongoose.model("payPal", payPalSchema);
