import productModel from "~/model/product/product.model";
import { Response, Request } from "express";
import { sendNotFound, sendSuccess } from "~/helpers/responses";

export class CustomerController {
  async getProducts(req: Request, res: Response) {
    const products = await productModel.find();
    if (products.length === 0) {
      sendNotFound(res, "No products found");
      return;
    }
    console.log(products);
    const response = {
      status: "success",
      data: products,
      code: 200,
      message: "Products retrieved successfully",
    };
    sendSuccess(res, response);
  }

//   async getProduct(req: Request, res: Response) {
//     const product = await productModel.findById(Number(req.params.productId));
//     if (!product) {
//       sendNotFound(res, "Product not found");
//       return;
//     }
//     const response = {
//       status: "success",
//       data: product,
//       code: 200,
//       message: "Product retrieved successfully",
//     };
//     sendSuccess(res, response);
//   }
}
