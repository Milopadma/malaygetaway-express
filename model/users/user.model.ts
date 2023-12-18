import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { User } from "../../types";

const userSchema = new Schema<User>({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    data: {
        type: { type: String, required: true },
        data: {
            // if its a merchant type
            merchantId: { type: Number, required: true, unique: true },
            phoneNumber: { type: Number, required: true },
            email: { type: String, required: true },
            status: { type: String, required: true },
        } || {
            // if its a customer type
            customerId: { type: Number, required: true, unique: true },
        } || {
            // if its a ministry officer type
            officerId: { type: Number, required: true, unique: true },
        },
    },

});

const userModel = model<User>("User", userSchema);

export default userModel;
