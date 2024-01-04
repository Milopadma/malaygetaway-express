import { model } from "mongoose";
import { Schema } from "mongoose";
import {
  CustomerData,
  MerchantData,
  MinistryOfficerData,
  User,
  UserType,
} from "../../types";

const userSchema = new Schema<
  User<
    | { type: UserType.MERCHANT; data: MerchantData }
    | { type: UserType.CUSTOMER; data: CustomerData }
    | { type: UserType.MINISTRY_OFFICER; data: MinistryOfficerData }
  >
>({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  data: {
    type: { type: String, required: true },
    data: {
      // if its a merchant type
      merchantId: { type: Number, required: true, unique: true },
      name: { type: String, required: true },
      contactNumber: { type: Number, required: true },
      contactEmail: { type: String, required: true },
      description: { type: String, required: true },
      businessFileURLs: { type: [String], required: true },
      status: { type: String, required: true },
      products: {
        type: [
          {
            productId: { type: Number, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            type: { type: String, required: true },
            productImageURLs: { type: [String], required: true },
            merchantId: { type: Number, required: true },
          },
        ],
        required: true,
      },
    } || {
        // if its a customer type
        customerId: { type: Number, required: true, unique: true },
      } || {
        // if its a ministry officer type
        officerId: { type: Number, required: true, unique: true },
      },
  },
});

const userModel = model<
  User<
    | { type: UserType.MERCHANT; data: MerchantData }
    | { type: UserType.CUSTOMER; data: CustomerData }
    | { type: UserType.MINISTRY_OFFICER; data: MinistryOfficerData }
  >
>("User", userSchema);

export default userModel;
