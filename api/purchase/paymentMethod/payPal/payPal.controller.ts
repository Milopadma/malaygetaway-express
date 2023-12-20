import PayPal from "../../../../model/purchase/payPal.model";
import {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} from "../../../../helpers/responses";

export class PayPalController {
  async createPayPal(
    req: {
      body: {
        email: any;
      };
    },
    res: any
  ) {
    try {
      const { email } = req.body;
      const payPal = await PayPal.create({ email });
      sendCreated(res, { data: { payPal } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getPayPal(req: any, res: any) {
    try {
      const payPal = await PayPal.find();
      sendSuccess(res, { data: { payPal } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getPayPalById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const payPal = await PayPal.findById(id);
      if (!payPal) {
        sendNotFound(res, "PayPal account not found");
      } else {
        sendSuccess(res, { data: { payPal } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updatePayPal(
    req: {
      params: { id: any };
      body: {
        email: any;
      };
    },
    res: any
  ) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const payPal = await PayPal.findById(id);

      if (!payPal) {
        sendNotFound(res, "PayPal account not found");
      } else {
        payPal.email = email;
        await payPal.save();
        sendSuccess(res, { data: { payPal } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deletePayPal(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const payPal = await PayPal.findByIdAndDelete(id);

      if (!payPal) {
        sendNotFound(res, "PayPal account not found");
      } else {
        sendSuccess(res, { data: { payPal } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
