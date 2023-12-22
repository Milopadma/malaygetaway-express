import Express from 'express';
import { CreditCardController } from './creditCard.controller';

const controller = new CreditCardController();
const CreditCardRouter = Express.Router();

CreditCardRouter.get('/get', controller.getCreditCard);
CreditCardRouter.get('/get/:id', controller.getCreditCardById);
CreditCardRouter.post('/create', controller.createCreditCard);
CreditCardRouter.put('/update/:id', controller.updateCreditCard);
CreditCardRouter.delete('/delete/:id', controller.deleteCreditCard);

export default CreditCardRouter;
