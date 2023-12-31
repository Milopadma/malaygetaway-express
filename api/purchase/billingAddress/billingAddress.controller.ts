import BillingAddress from "../../../model/purchase/billingAddress.model";
import {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} from "../../../helpers/responses";

export class BillingAddressController {
  async createBillingAddress(
    req: {
      body: {
        address: any;
        city: any;
        state: any;
        country: any;
        postalCode: any;
      };
    },
    res: any
  ) {
    try {
      const { address, city, state, country, postalCode } = req.body;
      const billingAddress = await BillingAddress.create({
        address,
        city,
        state,
        country,
        postalCode,
      });
      sendCreated(res, { data: { billingAddress } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getBillingAddress(req: any, res: any) {
    try {
      const billingAddress = await BillingAddress.find();
      sendSuccess(res, { data: { billingAddress } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getBillingAddressById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const billingAddress = await BillingAddress.findById(id);
      if (!billingAddress) {
        sendNotFound(res, "Billing address not found");
      } else {
        sendSuccess(res, { data: { billingAddress } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateBillingAddress(
    req: {
      params: { id: any };
      body: {
        address: any;
        city: any;
        state: any;
        country: any;
        postalCode: any;
      };
    },
    res: any
  ) {
    try {
      const { id } = req.params;
      const { address, city, state, country, postalCode } = req.body;
      const billingAddress = await BillingAddress.findById(id);

      if (!billingAddress) {
        sendNotFound(res, "Billing address not found");
      } else {
        billingAddress.address = address;
        billingAddress.city = city;
        billingAddress.state = state;
        billingAddress.country = country;
        billingAddress.postalCode = postalCode;

        await billingAddress.save();
        sendSuccess(res, { data: { billingAddress } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deleteBillingAddress(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const billingAddress = await BillingAddress.findByIdAndDelete(id);

      if (!billingAddress) {
        sendNotFound(res, "Billing address not found");
      } else {
        sendSuccess(res, { data: { billingAddress } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}