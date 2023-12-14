import mongoose from "mongoose";

export enum MerchantStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PENDING = "pending"
}

const merchantSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    phoneNumber: Number,
    email: String,
    status: {
        type: String,
        enum: Object.values(MerchantStatus),
        default: MerchantStatus.PENDING
    }
});

export default mongoose.model("Merchant", merchantSchema);
