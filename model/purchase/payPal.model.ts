import mongoose from "mongoose";

const payPalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
  },
  orderId: { type: String },
  paymentStatus: { type: String }, 
});

export default mongoose.model("PayPal", payPalSchema);
