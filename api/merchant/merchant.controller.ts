import {
  Business,
  MerchantData,
  UserType,
  User,
  MerchantStatus,
} from "../../types";
import { Response } from "express";
import userModel from "../../model/users/user.model";
import businessModel from "../../model/business/business.model";
import {
  sendInternalError,
  sendSuccess,
  sendNotFound,
  sendConflict,
} from "../../helpers/responses";
import {
  generateUniqueId,
  sendEmail,
  validateEmail,
  validatePhoneNumber,
} from "~/helpers/utils";

/**
 * Controller class for handling merchant operations.
 */
export class MerchantController {
  async newMerchant(
    req: { body: { merchant: MerchantData; business: Business } },
    res: Response
  ) {
    const { merchant, business } = req.body;
    try {
      const uniqueId = generateUniqueId();
      console.log("uniqueId", uniqueId);
      const uniqueUsername = `${merchant.email.split("@")[0]}${uniqueId}`;
      console.log("uniqueUsername", uniqueUsername);
      const uniquePassword = Math.random().toString(36).slice(-8);
      console.log("uniquePassword", uniquePassword);
      const uniqueMerchantEmail = await validateEmail(merchant.email);
      console.log("uniqueMerchantEmail", uniqueMerchantEmail);
      if (uniqueMerchantEmail == null) {
        sendConflict(res, "Email already exists");
        throw new Error("Email already exists");
      }
      const uniquePhoneNumber = await validatePhoneNumber(merchant.phoneNumber);
      console.log("uniquePhoneNumber", uniquePhoneNumber);
      if (uniquePhoneNumber == null) {
        sendConflict(res, "Phone number already exists");
        throw new Error("Phone number already exists");
      }

      // creating a new merchant
      const newUser: User<{ type: UserType.MERCHANT; data: MerchantData }> = {
        userId: uniqueId,
        username: uniqueUsername,
        password: uniqueId + uniquePassword,
        data: {
          type: UserType.MERCHANT,
          data: {
            merchantId: uniqueId,
            email: uniqueMerchantEmail,
            phoneNumber: uniquePhoneNumber,
            status: MerchantStatus.PENDING, // just ignore the merchant status from the request body since at this point it needs to always be PENDING
          },
        },
      };

      // new user from merchant data
      const newMerchantUser = new userModel(newUser);
      const newBusiness = new businessModel(business);
      await newMerchantUser.save();
      await newBusiness.save();
      // sned email
      sendEmail(
        merchant.email,
        "Account created",
        `Your account has been created. Your username is ${uniqueUsername} and your password is ${uniquePassword}`
      );
      sendSuccess(res, { data: newMerchantUser });

      // trigger send email
    } catch (error) {
      sendInternalError(res, error);
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
