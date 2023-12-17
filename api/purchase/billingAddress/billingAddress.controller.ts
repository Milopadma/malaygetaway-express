import BillingAddress from "../../../model/purchase-model/billingAddress.model";
const {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} = require("../../../helpers/responses");

export class BillingAddressController {
  async createBillingAddress(
    req: {
      body: {
        firstName: any;
        lastName: any;
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
      const { firstName, lastName, address, city, state, country, postalCode } =
        req.body;
      const billingAddress = await BillingAddress.create({
        firstName,
        lastName,
        address,
        city,
        state,
        country,
        postalCode,
      });
      sendCreated(res, { billingAddress });
    } catch (error) {
      sendInternalError(res, error);
    }
  }
  async getBillingAddress(req: any, res: any) {
    try {
      const billingAddress = await BillingAddress.find();
      sendSuccess(res, { billingAddress });
    } catch (error) {
      sendInternalError(res, error);
    }
  }
  async getBillingAddressById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const billingAddress = await BillingAddress.findById(id);
      if (!billingAddress) {
        sendNotFound(res);
      } else {
        sendSuccess(res, { billingAddress });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
  async updateBillingAddress(
    req: {
      params: { id: any };
      body: {
        firstName: any;
        lastName: any;
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
      const { firstName, lastName, address, city, state, country, postalCode } =
        req.body;
      const billingAddress = await BillingAddress.findById(id);
      if (!billingAddress) {
        sendNotFound(res);
      } else {
        billingAddress.firstName = firstName;
        billingAddress.lastName = lastName;
        billingAddress.address = address;
        billingAddress.city = city;
        billingAddress.state = state;
        billingAddress.country = country;
        billingAddress.postalCode = postalCode;
        await billingAddress.save();
        sendSuccess(res, { billingAddress });
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
        sendNotFound(res);
      } else {
        sendSuccess(res, { billingAddress });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
