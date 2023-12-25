import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PersonalDetail from '../../model/purchase/personalDetail.model';
import BillingAddress from '../../model/purchase/billingAddress.model';
import PayPal from '../../model/purchase/payPal.model';
import ReceiptModel from '../../model/receipt/receipt.model';
import {
  sendCreated,
  sendInternalError,
  sendSuccess,
  sendNotFound,
} from '../../helpers/responses';

export class ReceiptController {
  async createReceipt(req: Request, res: Response) {
    try {
      const userId = '6585013852d9a9c98342cb35';
      const personalId = '6585013852d9a9c98342cb35';
      const billingId = '6585c6c8730983d4b32045bc';
      const payId = '6587af46fa718fb0a7ab1089';
      const personalDetail = await PersonalDetail.findOne({ _id: personalId });
      const billingAddress = await BillingAddress.findOne({ _id: billingId });
      const payPalDetails = await PayPal.findOne({ _id: payId });

      console.log('UserID:', userId);
      console.log('PersonalDetail:', personalDetail);
      console.log('BillingAddress:', billingAddress);
      console.log('PayPalDetails:', payPalDetails);

      if (!personalDetail || !billingAddress || !payPalDetails) {
        sendNotFound(res, "One or more components of the receipt not found");
        return;
      }

      const receiptData = {
        userId,
        personalDetail: personalDetail.toObject(),
        billingAddress: billingAddress.toObject(),
        payPalDetails: payPalDetails.toObject(),
        createdAt: new Date() 
      };
      const receipt = await ReceiptModel.create(receiptData);

      sendCreated(res, { data: { receipt } });
    } catch (error) {
      if (error instanceof Error) {
        sendInternalError(res, error.message);
      } else {
        sendInternalError(res, 'An unknown error occurred');
      }
    }
  }

  async getReceiptById(req: Request, res: Response) {
    try {
      const receipt = await ReceiptModel.findById(req.params.id);

      if (!receipt) {
        sendNotFound(res, "Receipt not found");
      } else {
        sendSuccess(res, { data: { receipt } });
      }
    } catch (error) {
      if (error instanceof Error) {
        sendInternalError(res, error.message);
      } else {
        sendInternalError(res, 'An unknown error occurred');
      }
    }
  }
}
