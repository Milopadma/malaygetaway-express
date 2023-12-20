import {
  Business,
  MerchantData,
  MerchantStatus,
  User,
  UserType,
} from "../../types";
import { Response } from "express";
import userModel from "../../model/users/user.model";
import businessModel from "../../model/business/business.model";
import {
  sendInternalError,
  sendSuccess,
  sendNotFound,
} from "../../helpers/responses";
import { Model } from "mongoose";

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
      const newMerchant = new userModel(merchant);
      const newBusiness = new businessModel(business);
      await newMerchant.save();
      await newBusiness.save();
      sendSuccess(res, { data: newMerchant });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getMerchants(res: Response) {
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
      const merchantsById = await userModel.findById({
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
      const merchantUpdated = await userModel.findById(merchantId);
      if (!merchantUpdated) {
        sendNotFound(res, "Merchant not found");
      } else {
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
  // async toggleMerchantStatus(
  //   req: { params: { merchantId: number } },
  //   res: any
  // ) {
  //   try {
  //     const { merchantId } = req.params;
  //     const merchant = (await userModel.findById(
  //       merchantId
  //     ));
  //     if (!merchant) {
  //       sendNotFound(res, "Merchant not found" );
  //     } else {
  //       merchant.data.data.status =
  //         merchant.data.data.status === MerchantStatus.ACCEPTED
  //           ? MerchantStatus.REJECTED
  //           : MerchantStatus.ACCEPTED;
  //       await merchant.save();
  //       sendSuccess(res, { data: merchant });
  //     }
  //   } catch (error) {
  //     sendInternalError(res, error);
  //   }
  // }
}
