import CreditCard from "../../../../model/purchase/creditCard.model";
import {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} from "../../../../helpers/responses";

export class CreditCardController {
  async createCreditCard(
    req: {
      body: {
        cardNumber: any;
        cardHolderName: any;
        expirationDate: any;
        cvv: any;
      };
    },
    res: any
  ) {
    try {
      const { cardNumber, cardHolderName, expirationDate, cvv } = req.body;
      const creditCard = await CreditCard.create({
        cardNumber,
        cardHolderName,
        expirationDate,
        cvv,
      });
      sendCreated(res, { data: { creditCard } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getCreditCard(req: any, res: any) {
    try {
      const creditCard = await CreditCard.find();
      sendSuccess(res, { data: { creditCard } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getCreditCardById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const creditCard = await CreditCard.findById(id);
      if (!creditCard) {
        sendNotFound(res, "Credit card not found");
      } else {
        sendSuccess(res, { data: { creditCard } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateCreditCard(
    req: {
      params: { id: any };
      body: {
        cardNumber: any;
        cardHolderName: any;
        expirationDate: any;
        cvv: any;
      };
    },
    res: any
  ) {
    try {
      const { id } = req.params;
      const { cardNumber, cardHolderName, expirationDate, cvv } = req.body;
      const creditCard = await CreditCard.findById(id);

      if (!creditCard) {
        sendNotFound(res, "Credit card not found");
      } else {
        creditCard.cardNumber = cardNumber;
        creditCard.cardHolderName = cardHolderName;
        creditCard.expirationDate = expirationDate;
        creditCard.cvv = cvv;

        await creditCard.save();
        sendSuccess(res, { data: { creditCard } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deleteCreditCard(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const creditCard = await CreditCard.findByIdAndDelete(id);

      if (!creditCard) {
        sendNotFound(res, "Credit card not found");
      } else {
        sendSuccess(res, { data: { creditCard } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
