import merchantModel, { MerchantStatus } from "../../model/merchant.model";
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
  async createMerchant(
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
      const merchantRegistration = await merchantModel.create({
        firstName,
        lastName,
        address,
        city,
        state,
        country,
        postalCode,
      });
      sendCreated(res, { merchantRegistration });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Retrieves all merchant registrations.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to an array of merchant registrations.
   */
  async getMerchant(req: any, res: any) {
    try {
      const merchantRegistration = await merchantModel.find();
      sendSuccess(res, { merchantRegistration });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Retrieves a merchant registration by ID.
   * @param req - The request object containing the merchant ID.
   * @param res - The response object.
   * @returns A promise that resolves to the found merchant registration.
   */
  async getMerchantById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const merchantRegistration = await merchantModel.findById(id);
      if (!merchantRegistration) {
        sendNotFound(res);
      } else {
        sendSuccess(res, { merchantRegistration });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Updates a merchant registration.
   * @param req - The request object containing the merchant ID and updated details.
   * @param res - The response object.
   * @returns A promise that resolves to the updated merchant registration.
   */
  async updateMerchant(
    req: {
      params: { id: any };
      body: {
        username: any;
        password: any;
        phoneNumber: any;
        email: any;
        status: any;
      };
    },
    res: any
  ) {
    try {
      const { id } = req.params;
      const { username, password, phoneNumber, email, status } = req.body;
      const merchantRegistration = await merchantModel.findById(id);
      if (!merchantRegistration) {
        sendNotFound(res);
      } else {
        merchantRegistration.id = id;
        merchantRegistration.username = username;
        merchantRegistration.password = password;
        merchantRegistration.phoneNumber = phoneNumber;
        merchantRegistration.email = email;
        merchantRegistration.status = status;
        await merchantRegistration.save();
        sendSuccess(res, { merchantRegistration });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Deletes a merchant registration.
   * @param req - The request object containing the merchant ID.
   * @param res - The response object.
   * @returns A promise that resolves to the deleted merchant registration.
   */
  async deleteMerchant(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const merchantRegistration = await merchantModel.findByIdAndDelete(id);
      if (!merchantRegistration) {
        sendNotFound(res);
      } else {
        sendSuccess(res, { merchantRegistration });
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
  async toggleMerchantStatus(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const merchantRegistration = await merchantModel.findById(id);
      if (!merchantRegistration) {
        sendNotFound(res);
      } else {
        merchantRegistration.status =
          merchantRegistration.status === MerchantStatus.ACCEPTED
            ? MerchantStatus.REJECTED
            : MerchantStatus.ACCEPTED;
        await merchantRegistration.save();
        sendSuccess(res, { merchantRegistration });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
