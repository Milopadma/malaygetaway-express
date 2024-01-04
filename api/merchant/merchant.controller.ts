import {
  Business,
  MerchantData,
  UserType,
  User,
  MerchantStatus,
  MerchantDataResponse,
  Product,
} from "../../types";
import { Response } from "express";
import businessModel from "../../model/business/business.model";
import {
  sendInternalError,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendError,
} from "../../helpers/responses";
import {
  generateUniqueId,
  sendEmail,
  validateEmail,
  validatePhoneNumber,
} from "~/helpers/utils";
import userModel from "~/model/users/user.model";
import productModel from "~/model/product/product.model";

/**
 * Controller class for handling merchant operations.
 */
export class MerchantController {
  async newMerchant(req: { body: { merchant: MerchantData } }, res: Response) {
    try {
      console.log("req.body", req.body);
      const { merchant } = req.body;
      const uniqueId = generateUniqueId();
      console.log("uniqueId", uniqueId);
      const uniqueUsername = `${
        merchant.contactEmail.split("@")[0]
      }${uniqueId}`;
      console.log("uniqueUsername", uniqueUsername);
      const uniquePassword = Math.random().toString(36).slice(-8);
      console.log("uniquePassword", uniquePassword);
      const uniqueMerchantEmail = await validateEmail(merchant.contactEmail);
      console.log("uniqueMerchantEmail", uniqueMerchantEmail);
      if (uniqueMerchantEmail == null) {
        sendConflict(res, "Email already exists");
        throw new Error("Email already exists");
      }
      const uniqueNumberCheck = await validatePhoneNumber(
        merchant.contactNumber
      );
      console.log("uniqueNumberCheck", uniqueNumberCheck);
      if (uniqueNumberCheck == null) {
        sendConflict(res, "Phone number already exists");
        throw new Error("Phone number already exists");
      }
      // const hashedPassword = await Bun.password.hash(uniqueId + uniquePassword);
      const hashedPassword = await Bun.password.hash("pw" + uniqueUsername);
      console.log("hashedPassword", hashedPassword);

      // creating a new merchant
      const newUser: User<{ type: UserType.MERCHANT; data: MerchantData }> = {
        userId: uniqueId,
        username: uniqueUsername,
        password: hashedPassword,
        data: {
          type: UserType.MERCHANT,
          data: {
            merchantId: uniqueId,
            name: merchant.name,
            contactNumber: merchant.contactNumber,
            contactEmail: merchant.contactEmail,
            description: merchant.description,
            businessFileURLs: merchant.businessFileURLs,
            status: MerchantStatus.PENDING, // just ignore the merchant status from the request body since at this point it needs to always be PENDING
            products: [],
          },
        },
      };
      console.log("newUser", newUser);

      // new user from merchant data
      const newMerchantUser = new userModel(newUser);
      await newMerchantUser.save();
      console.log("newMerchantUser", newMerchantUser);

      sendSuccess(res, { data: newMerchantUser });

      // trigger send email
    } catch (error) {
      sendError(res, 500, { message: "Something failed.", data: error });
    }
  }

  async getMerchants(req: any, res: Response) {
    try {
      const users = await userModel.find({ "data.type": "merchant" });
      const merchants = users.map((user) => user.data.data) as MerchantData[];
      const response: MerchantDataResponse = {
        status: "success",
        code: 200,
        data: merchants,
        message: "Merchants retrieved successfully",
      };
      sendSuccess(res, response);
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getMerchantById(req: { params: { merchantId: number } }, res: any) {
    try {
      const { merchantId } = req.params;
      const merchantsById = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantsById) {
        sendNotFound(res, "Merchant not found");
      } else {
        sendSuccess(res, { data: merchantsById });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updateMerchantData(
    req: { params: { merchantId: number }; body: { merchant: MerchantData } },
    res: any
  ) {
    try {
      const merchantId = Number(req.params.merchantId);
      const { merchant } = req.body;
      const merchantUpdated = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantUpdated) {
        sendNotFound(res, "Merchant not found");
      } else {
        console.log("merchantUpdated", merchantUpdated);
        merchantUpdated.data.data = merchant;
        await merchantUpdated.save();
        sendSuccess(res, { data: merchantUpdated });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  /**
   * Toggles the status of a merchant registration.
   * @param req - The request object containing the merchant ID.
   * @param res - The response object.
   * @returns A promise that resolves to the updated merchant registration.
   */
  async setMerchantStatus(
    req: { params: { merchantId: number }; body: { status: MerchantStatus } },
    res: any
  ) {
    try {
      const { merchantId } = req.params;
      const { status } = req.body;
      const merchantUpdated = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchantUpdated) {
        sendNotFound(res, "Merchant not found");
      } else {
        merchantUpdated.data.data = {
          ...merchantUpdated.data.data,
          status,
        };
        await merchantUpdated.save();
        sendSuccess(res, { data: merchantUpdated });

        // send email
        sendEmail(
          (merchantUpdated.data.data as MerchantData).contactEmail,
          "Account created",
          `<div>
          <h3>MalayGetaway</h3>
          <h1>Congratulations!</h1>
          <div>Your account has been created.</div>
          <div> Your username is <strong>${
            (merchantUpdated.data.data as MerchantData).contactEmail
          }</strong> and your password is 
          <strong>${"pw" + merchantUpdated.username}</strong></div>
          <div>Explore malaysia now! <a href="https://malaygetaway-angular.milopadma.com/login">malaygetaway-angular.milopadma.com</a></div>
        </div>`
        );
        console.log("Email sent");
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkMerchantName(req: { params: { name: string } }, res: any) {
    try {
      const { name: username } = req.params;
      const isUsernameExist = await userModel.findOne({
        "data.data.name": username,
      });
      if (isUsernameExist) {
        console.log("isUsernameExist", isUsernameExist);
        sendConflict(res, "Username already exists");
      } else {
        console.log("isUsernameExist", isUsernameExist);
        sendSuccess(res, { data: { username } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkEmail(req: { params: { email: string } }, res: any) {
    try {
      const { email } = req.params;
      const isEmailExist = await userModel.findOne({
        "data.type": "merchant",
        "data.data.contactEmail": email,
      });
      if (isEmailExist) {
        sendConflict(res, "Email already exists");
      } else {
        sendSuccess(res, { data: { email } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkNumber(req: { params: { contactNumber: number } }, res: any) {
    try {
      const { contactNumber } = req.params;
      const isPhoneNumberExist = await userModel.findOne({
        "data.type": "merchant",
        "data.data.contactNumber": contactNumber,
      });
      if (isPhoneNumberExist) {
        sendConflict(res, "Phone number already exists");
      } else {
        sendSuccess(res, { data: { contactNumber } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  // products related
  async getProducts(req: { params: { merchantId: number } }, res: any) {
    try {
      const { merchantId } = req.params;
      const merchant = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": merchantId,
      });
      if (!merchant) {
        sendNotFound(res, "Merchant not found");
      } else {
        const merchantData = merchant.data.data as MerchantData;
        sendSuccess(res, { data: merchantData.products });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getSingleProduct(req: { params: { productId: number } }, res: any) {
    try {
      const productId = Number(req.params.productId);
      console.log("productId:", productId);
      const merchant = await userModel.findOne({
        "data.type": "merchant",
        "data.data.products.productId": productId,
      });
      if (!merchant) {
        sendNotFound(res, "Product not found");
      } else {
        const merchantData = merchant.data.data as MerchantData;
        console.log("merchantData.products:", merchantData.products);
        const product = merchantData.products.find(
          (product) => product.productId === productId
        );
        if (!product) {
          sendNotFound(res, "Product not found");
        }
        sendSuccess(res, { data: product });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async addProduct(req: { body: { product: Product } }, res: any) {
    try {
      const { product } = req.body;

      if (!product) {
        res
          .status(400)
          .json({ success: false, message: "Product data is required" });
        return;
      }

      // Check if required fields are present
      const requiredFields = [
        "productId",
        "name",
        "address",
        "description",
        "price",
        "type",
        "productImageURLs",
        "merchantId",
      ];
      for (let field of requiredFields) {
        if (!product[field]) {
          res
            .status(400)
            .json({ success: false, message: `Product ${field} is required` });
          return;
        }
      }

      console.log("product:", product);
      console.log("product.merchantid:", product.merchantId);

      const merchant = await userModel.findOne({
        "data.type": "merchant",
        "data.data.merchantId": product.merchantId,
      });
      console.log("merchant:", merchant);

      if (!merchant) {
        sendNotFound(res, "Merchant not found");
      } else {
        const merchantData = merchant.data.data as MerchantData;
        merchantData.products.push(product);
        await merchant.save();
        console.log("merchantData.products:", merchantData.products);

        // Save product data in ProductModel
        const newProduct = new productModel(product);
        await newProduct.save();

        sendSuccess(res, { data: merchantData.products });
      }
    } catch (error) {
      console.log("error:", error);
      sendInternalError(res, error);
    }
  }

  async updateProduct(
    req: {
      params: { productId: number };
      body: { product: Product };
    },
    res: any
  ) {
    try {
      const productId = Number(req.params.productId);
      const { product } = req.body;
      console.log("productId:", productId);
      console.log("product:", product);
      const merchant = await userModel.findOne({
        "data.type": "merchant",
        "data.data.products.productId": productId,
      });
      console.log("merchant:", merchant);
      if (!merchant) {
        sendNotFound(res, "Merchant not found");
      } else {
        const merchantData = merchant.data.data as MerchantData;
        const productToUpdate = merchantData.products.find(
          (product) => product.productId === productId
        );
        console.log("product:", product);
        if (!productToUpdate) {
          sendNotFound(res, "Product not found");
        } else {
          productToUpdate.name = product.name;
          productToUpdate.description = product.description;
          productToUpdate.address = product.address;
          productToUpdate.price = product.price;
          productToUpdate.productImageURLs = product.productImageURLs;
          productToUpdate.type = product.type;

          await merchant.save();
          console.log("merchantData.products:", merchantData.products);
          sendSuccess(res, { data: merchantData.products });
        }
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deleteProduct(req: { params: { productId: number } }, res: any) {
    try {
      const productId = Number(req.params.productId);
      const merchant = await userModel.findOne({
        "data.type": "merchant",
        "data.data.products.productId": productId,
      });
      if (!merchant) {
        sendNotFound(res, "Merchant not found");
      } else {
        const merchantData = merchant.data.data as MerchantData;
        const productToDelete = merchantData.products.find(
          (product) => product.productId === productId
        );
        console.log("product:", productToDelete);
        if (!productToDelete) {
          sendNotFound(res, "Product not found");
        } else {
          merchantData.products = merchantData.products.filter(
            (product) => product.productId !== productId
          );
          await merchant.save();
          sendSuccess(res, { data: merchantData.products });
        }
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}
