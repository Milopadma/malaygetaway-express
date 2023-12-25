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
import * as paypalSDK from '@paypal/checkout-server-sdk';

function paypalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.NODE_ENV === "production"
    ? new paypalSDK.core.LiveEnvironment(clientId, clientSecret)
    : new paypalSDK.core.SandboxEnvironment(clientId, clientSecret);
}

function paypalClient() {
  return new paypalSDK.core.PayPalHttpClient(paypalEnvironment());
}
export class PayPalController {
  async createOrder(req: any, res: any) {
    const { intent, currency_code, value } = req.body;
  
    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.requestBody({
      intent: intent,
      purchase_units: [{
        amount: { 
          currency_code: currency_code,
          value: value
        }
      }]
    });
  
    try {
      const response = await paypalClient().execute(request);
      const orderData = {
          intent: intent,
          currency_code: currency_code,
          value: value,
          orderID: response.result.id
      };
      sendCreated(res, { data: { orderData } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }
  

  async createPayPal(req: { body: { email: any } }, res: any) {
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

  async updatePayPal(req: { params: { id: any }, body: { email: any } }, res: any) {
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
