import { Request, Response } from 'express';
import ReceiptModel from '../../model/receipt/receipt.model';
import { sendCreated, sendInternalError, sendNotFound, sendSuccess } from '../../helpers/responses';

export class ReceiptController {
  async createReceipt(req: Request, res: Response) {
    try {
      const { userId, personalId, billingId, payId } = req.body;

      const receiptData = { userId, personalDetail: personalId, billingAddress: billingId, payPalDetails: payId, createdAt: new Date() };
      const receipt = await ReceiptModel.create(receiptData);

      sendCreated(res, { data: { receipt } });
    } catch (error) {
      if (error instanceof Error) {
        sendInternalError(res, 'Error creating receipt: ' + error.message);
      } else {
        sendInternalError(res, 'An unknown error occurred while creating receipt');
      }
    }
  }

  async getReceiptById(req: Request, res: Response) {
    try {
      const receiptId = req.params.id;

      const receipt = await ReceiptModel.findById(receiptId)
        .populate('personalDetail')
        .populate('billingAddress')
        .populate('payPalDetails')
        .exec();

      if (!receipt) {
        sendNotFound(res, "Receipt not found");
        return;
      }

      sendSuccess(res, { data: { receipt } });
    } catch (error) {
      if (error instanceof Error) {
        sendInternalError(res, error.message);
      } else {
        sendInternalError(res, 'An unknown error occurred while fetching receipt');
      }
    }
  }
}
