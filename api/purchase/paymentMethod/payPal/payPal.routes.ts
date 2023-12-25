import Express from 'express';
import { PayPalController } from './payPal.controller';

const controller = new PayPalController();
const PayPalRouter = Express.Router();

PayPalRouter.get('/get', controller.getPayPal);
PayPalRouter.get('/get/:id', controller.getPayPalById);
PayPalRouter.post('/create', controller.createPayPal);
PayPalRouter.put('/update/:id', controller.updatePayPal);
PayPalRouter.delete('/delete/:id', controller.deletePayPal);
PayPalRouter.post('/create-order', controller.createOrder);

export default PayPalRouter;