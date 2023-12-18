import { CustomerData, MerchantData, MerchantStatus, User } from "../../types";
import { Request } from "express";
import userModel from "../../model/users/user.model";

const {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} = require("../../helpers/responses");

/**
 * Controller class for handling merchant operations.
 */
export class MerchantController {
  async getMerchants(res: any) {
    try {
      const merchants = await userModel.find({ "data.type": "merchant" });
      sendSuccess(res, { merchants });
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
        sendNotFound(res);
      } else {
        sendSuccess(res, { merchantsById });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateMerchantData(req: Request<MerchantData>, res: any) {
    try {
      const { merchantId } = req.params;
      const { merchant } = req.body;
      const merchantUpdated = (await userModel.findById(
        merchantId
      )) as User<CustomerData>;
      if (!merchantUpdated) {
        sendNotFound(res);
      } else {
        // merchantUpdated.data.
        // merchantUpdated.email = email;
        // merchantUpdated.status = status;
        // await merchantUpdated.save();
        sendSuccess(res, { merchantUpdated });
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
  async toggleMerchantStatus(
    req: { params: { merchantId: number } },
    res: any
  ) {
    try {
      const { merchantId } = req.params;
      const merchant = (await userModel.findById(
        merchantId
      )) as User<MerchantData>;
      if (!merchant) {
        sendNotFound(res);
      } else {
        merchant.data.status =
          merchant.data.status === MerchantStatus.ACCEPTED
            ? MerchantStatus.REJECTED
            : MerchantStatus.ACCEPTED;
        await merchant.save();
        sendSuccess(res, { merchant });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
