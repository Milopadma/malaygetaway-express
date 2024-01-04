import mongoose from "mongoose";

const formReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export default mongoose.model("FormReview", formReviewSchema);
