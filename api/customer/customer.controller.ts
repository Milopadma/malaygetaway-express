import productModel from "~/model/product/product.model";
import { Response, Request } from "express";
import { sendSuccess } from "~/helpers/responses";

export class CustomerController {
  async getProducts(req: Request, res: Response) {
    const products = await productModel.find();
    const response = {
      status: "success",
      data: products,
      code: 200,
      message: "Products retrieved successfully",
    };
    sendSuccess(res, response);
  }

  async getProduct(req: Request, res: Response) {
    const product = await productModel.findById(Number(req.params.productId));
    const response = {
      status: "success",
      data: product,
      code: 200,
      message: "Product retrieved successfully",
    };
    sendSuccess(res, response);
  }
}
