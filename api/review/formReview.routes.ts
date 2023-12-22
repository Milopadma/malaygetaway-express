import Express from 'express';
import { FormReviewController } from './formReview.controller';

const controller = new FormReviewController();
const FormReviewRouter = Express.Router();

FormReviewRouter.get('/get', controller.getFormReviews);
FormReviewRouter.get('/get/:id', controller.getFormReviewById);
FormReviewRouter.post('/create', controller.createFormReview);
FormReviewRouter.put('/update/:id', controller.updateFormReview);
FormReviewRouter.delete('/delete/:id', controller.deleteFormReview);

export default FormReviewRouter;