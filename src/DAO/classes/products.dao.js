import ProductModel from '../models/products.model.js';

class ProductsDAO {
  async getAllProductsDao(filter, options) {
    try {
      const products = await ProductModel.paginate(filter, options);
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductByIdDao(pid) {
    const product = ProductModel.findById(pid);
    return product;
  }
  async getProductByCodeDao(code) {
    try {
      const product = await ProductModel.findOne({ code });
      return product;
    } catch (err) {
      throw `No se encontró el producto.`;
    }
  }
  async createOneProductDao(productData) {
    const product = ProductModel.create(productData);
    return product;
  }
  async updateOneProductDao(pid, updatedData) {
    const product = ProductModel.findByIdAndUpdate(pid, updatedData, { new: true });
    return product;
  }
  async deleteOneProductDao(pid) {
    const product = await ProductModel.findById(pid);
    if (!product) {
      throw new Error(`Product with id ${pid} not found`);
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(pid);
    return deletedProduct;
  }
}
export default ProductsDAO;
