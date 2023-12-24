import {
  Business,
  MerchantData,
  UserType,
  User,
  MerchantStatus,
} from "../../types";
import { Response } from "express";
import businessModel from "../../model/business/business.model";
import {
  sendInternalError,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendError,
} from "../../helpers/responses";
import {
  generateUniqueId,
  sendEmail,
  validateEmail,
  validatePhoneNumber,
} from "~/helpers/utils";
import userModel from "~/model/users/user.model";

/**
 * Controller class for handling merchant operations.
 */
export class MerchantController {
  async newMerchant(req: { body: { merchant: MerchantData } }, res: Response) {
    try {
      console.log("req.body", req.body);
      const { merchant } = req.body;
      const uniqueId = generateUniqueId();
      console.log("uniqueId", uniqueId);
      const uniqueUsername = `${
        merchant.contactEmail.split("@")[0]
      }${uniqueId}`;
      console.log("uniqueUsername", uniqueUsername);
      const uniquePassword = Math.random().toString(36).slice(-8);
      console.log("uniquePassword", uniquePassword);
      const uniqueMerchantEmail = await validateEmail(merchant.contactEmail);
      console.log("uniqueMerchantEmail", uniqueMerchantEmail);
      if (uniqueMerchantEmail == null) {
        sendConflict(res, "Email already exists");
        throw new Error("Email already exists");
      }
      const uniqueNumberCheck = await validatePhoneNumber(
        merchant.contactNumber
      );
      console.log("uniqueNumberCheck", uniqueNumberCheck);
      if (uniqueNumberCheck == null) {
        sendConflict(res, "Phone number already exists");
        throw new Error("Phone number already exists");
      }
      const hashedPassword = await Bun.password.hash(uniqueId + uniquePassword);
      console.log("hashedPassword", hashedPassword);

      // creating a new merchant
      const newUser: User<{ type: UserType.MERCHANT; data: MerchantData }> = {
        userId: uniqueId,
        username: uniqueUsername,
        password: hashedPassword,
        data: {
          type: UserType.MERCHANT,
          data: {
            merchantId: uniqueId,
            name: merchant.name,
            contactNumber: merchant.contactNumber,
            contactEmail: merchant.contactEmail,
            description: merchant.description,
            businessFileURLs: merchant.businessFileURLs,
            status: MerchantStatus.PENDING, // just ignore the merchant status from the request body since at this point it needs to always be PENDING
          },
        },
      };
      console.log("newUser", newUser);

      // new user from merchant data
      const newMerchantUser = new userModel(newUser);
      await newMerchantUser.save();
      console.log("newMerchantUser", newMerchantUser);

      // send email
      sendEmail(
        merchant.contactEmail,
        "Account created",
        `<div>
          <h3>MalayGetaway</h3>
          <h1>Congratulations!</h1>
          <div>Your account has been created.</div>
          <div> Your username is <strong>${uniqueUsername}</strong> and your password is 
          <strong>${uniqueId + uniquePassword}</strong></div>
          <div>Explore malaysia now! <a href="https://malaygetaway-angular.milopadma.com/login">malaygetaway-angular.milopadma.com</a></div>
        </div>`
      );
      console.log("Email sent");

      sendSuccess(res, { data: newMerchantUser });

      // trigger send email
    } catch (error) {
      sendError(res, 500, { message: "Something failed.", data: error });
    }
  }

  async getMerchants(req: any, res: Response) {
    try {
      const merchants = await userModel.find({ "data.type": "merchant" });
      sendSuccess(res, { data: merchants });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getMerchantById(req: { params: { merchantId: number } }, res: any) {
    try {
      const { merchantId } = req.params;
      const merchantsById = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantsById) {
        sendNotFound(res, "Merchant not found");
      } else {
        sendSuccess(res, { data: merchantsById });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateMerchantData(
    req: { params: { merchantId: number }; body: { merchant: MerchantData } },
    res: any
  ) {
    try {
      const { merchantId } = req.params;
      const { merchant } = req.body;
      const merchantUpdated = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantUpdated) {
        sendNotFound(res, "Merchant not found");
      } else {
        console.log("merchantUpdated", merchantUpdated);
        merchantUpdated.data.data = merchant;
        await merchantUpdated.save();
        sendSuccess(res, { data: merchantUpdated });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Toggles the status of a merchant registration.
   * @param req - The request object containing the merchant ID.
   * @param res - The response object.
   * @returns A promise that resolves to the updated merchant registration.
   */
  async setMerchantStatus(
    req: { params: { merchantId: number }; body: { status: MerchantStatus } },
    res: any
  ) {
    try {
      const { merchantId } = req.params;
      const { status } = req.body;
      const merchantUpdated = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantUpdated) {
        sendNotFound(res, "Merchant not found");
      } else {
        merchantUpdated.data.data = {
          ...merchantUpdated.data.data,
          status,
        };
        await merchantUpdated.save();
        sendSuccess(res, { data: merchantUpdated });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
