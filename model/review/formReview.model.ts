import mongoose from "mongoose";

const formReviewSchema = new mongoose.Schema({
  orderRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  serviceRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  priceRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  placeRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
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
