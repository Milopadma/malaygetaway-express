import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  personalDetail: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  billingAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  payPalDetails: {
    email: String,
    orderId: String,
    paymentStatus: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Receipt', receiptSchema);
