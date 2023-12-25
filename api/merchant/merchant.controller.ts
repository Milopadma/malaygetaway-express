import {
  Business,
  MerchantData,
  UserType,
  User,
  MerchantStatus,
  MerchantDataResponse,
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
      // const hashedPassword = await Bun.password.hash(uniqueId + uniquePassword);
      const hashedPassword = await Bun.password.hash("pw" + uniqueUsername);
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

      sendSuccess(res, { data: newMerchantUser });

      // trigger send email
    } catch (error) {
      sendError(res, 500, { message: "Something failed.", data: error });
    }
  }

  async getMerchants(req: any, res: Response) {
    try {
      const users = await userModel.find({ "data.type": "merchant" });
      const merchants = users.map((user) => user.data.data) as MerchantData[];
      const response: MerchantDataResponse = {
        status: "success",
        code: 200,
        data: merchants,
        message: "Merchants retrieved successfully",
      };
      sendSuccess(res, response);
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

        // send email
        sendEmail(
          (merchantUpdated.data.data as MerchantData).contactEmail,
          "Account created",
          `<div>
          <h3>MalayGetaway</h3>
          <h1>Congratulations!</h1>
          <div>Your account has been created.</div>
          <div> Your username is <strong>${
            merchantUpdated.username
          }</strong> and your password is 
          <strong>${"pw" + merchantUpdated.username}</strong></div>
          <div>Explore malaysia now! <a href="https://malaygetaway-angular.milopadma.com/login">malaygetaway-angular.milopadma.com</a></div>
        </div>`
        );
        console.log("Email sent");
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkMerchantName(req: { params: { name: string } }, res: any) {
    try {
      const { name: username } = req.params;
      const isUsernameExist = await userModel.findOne({
        "data.data.name": username,
      });
      if (isUsernameExist) {
        console.log("isUsernameExist", isUsernameExist);
        sendConflict(res, "Username already exists");
      } else {
        console.log("isUsernameExist", isUsernameExist);
        sendSuccess(res, { data: { username } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkEmail(req: { params: { email: string } }, res: any) {
    try {
      const { email } = req.params;
      const isEmailExist = await userModel.findOne({
        "data.type": "merchant",
        "data.data.contactEmail": email,
      });
      if (isEmailExist) {
        sendConflict(res, "Email already exists");
      } else {
        sendSuccess(res, { data: { email } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkNumber(req: { params: { contactNumber: number } }, res: any) {
    try {
      const { contactNumber } = req.params;
      const isPhoneNumberExist = await userModel.findOne({
        "data.type": "merchant",
        "data.data.contactNumber": contactNumber,
      });
      if (isPhoneNumberExist) {
        sendConflict(res, "Phone number already exists");
      } else {
        sendSuccess(res, { data: { contactNumber } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
