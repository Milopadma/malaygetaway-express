import Express from 'express';
import { ReceiptController } from './receipt.controller';

const controller = new ReceiptController();
const ReceiptRouter = Express.Router();
ReceiptRouter.post('/create', controller.createReceipt);
ReceiptRouter.get('/get/:id', controller.getReceiptById);

export default ReceiptRouter;

