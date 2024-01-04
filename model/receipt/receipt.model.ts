import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  personalDetail: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalDetail' },
  billingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'BillingAddress' },
  payPalDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'PayPal' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Receipt', receiptSchema);
