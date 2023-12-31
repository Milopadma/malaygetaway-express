import mongoose from "mongoose";

const personalDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "DUMAI", required: true },
  country: { type: String, default: "USA" },
  postalCode: { type: String, required: true },
});

export default mongoose.model("PersonalDetail", personalDetailSchema);
