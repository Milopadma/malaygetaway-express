import { model, Schema } from "mongoose";

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  type: string;
  productImageURLs: string[];
  merchantId: number;
}

const productSchema = new Schema<Product>({
  productId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  productImageURLs: { type: [String], required: true },
  merchantId: { type: Number, required: true },
});

const productModel = model<Product>("Product", productSchema);

export default productModel;
