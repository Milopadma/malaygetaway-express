import productModel from "~/model/product/product.model";

export class CustomerController {
  async newCustomer(req, res) {
    const { name, contactNumber, contactEmail, password, address } = req.body;
    const customer = await customerModel
      .create({
        name,
        contactNumber,
        contactEmail,
        password,
        address,
      })
      .save();
    res.json(customer);
  }

  async getProducts(req, res) {
    const products = await productModel.find();
    res.json(products);
  }
}
