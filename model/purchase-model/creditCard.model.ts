import mongoose from "mongoose";

const creditCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    match: [/^\d{4} \d{4} \d{4} \d{4}$/, 'Card number must be in format: "XXXX XXXX XXXX XXXX"'], // Validasi format nomor kartu
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
    match: [/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{2}$/, 'Expiration date must be in format: "MM/DD/YY"'],
  },
  cvv: {
    type: String,
    required: true,
    match: [/^\d{3}$/, 'CVV must be 3 digits'], // Validasi format CVV
  },
});

export default mongoose.model("creditCard", creditCardSchema);
