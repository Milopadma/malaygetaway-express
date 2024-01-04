import FormReview from "../../model/review/formReview.model";
import {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} from "../../helpers/responses";

export class FormReviewController {
  async createFormReview(req: {
    body: {
      orderRating: number;
      serviceRating: number;
      priceRating: number;
      placeRating: number;
      overallRating: number;
      name: string;
      email: string;
      product: string;
      description: string;
    };
  }, res: any) {
    try {
      const {
        name,
        email,
        product,
        description,
      } = req.body;

      const formReview = await FormReview.create({
        name,
        email,
        product,
        description,
      });

      sendCreated(res, { data: { formReview } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getFormReviews(req: any, res: any) {
    try {
      const formReviews = await FormReview.find();
      sendSuccess(res, { data: { formReviews } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getFormReviewById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const formReview = await FormReview.findById(id);

      if (!formReview) {
        sendNotFound(res, "Form review not found");
      } else {
        sendSuccess(res, { data: { formReview } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateFormReview(req: {
    params: { id: any };
    body: {
      name: string;
      email: string;
      product: string;
      description: string;
    };
  }, res: any) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const formReview = await FormReview.findById(id);

      if (!formReview) {
        sendNotFound(res, "Form review not found");
      } else {
        Object.assign(formReview, updateData);
        await formReview.save();
        sendSuccess(res, { data: { formReview } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deleteFormReview(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const formReview = await FormReview.findByIdAndDelete(id);

      if (!formReview) {
        sendNotFound(res, "Form review not found");
      } else {
        sendSuccess(res, { data: { formReview } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
