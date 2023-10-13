import ProductsDAO from '../DAO/classes/products.dao.js';
import CustomError from '../error/customError.js';
import { customErrorMsg } from '../error/customErrorMessage.js';
import EErros from '../error/enum.js';
import { logger } from '../utils/logger.js';
const productsDAO = new ProductsDAO();

class ServiceProducts {
  async getAllProductsService(page, limit, sort, query, titleFilter) {
    try {
      const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
      const options = {
        limit: limit || 5,
        page: page || 1,
        sort: sort === 'desc' ? '-price' : 'price',
        lean: true,
      };
      const products = await productsDAO.getAllProductsDao(filter, options);
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getFilteredProductsService(page, limit, sort, query, titleFilter) {
    try {
      const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
      filter.title = { $regex: titleFilter, $options: 'i' };
      const options = {
        limit: limit || 5,
        page: page || 1,
        sort: sort === 'desc' ? '-price' : 'price',
        lean: true,
      };
      const products = await productsDAO.getAllProductsDao(filter, options);
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductByIdService(pid) {
    try {
      const product = await productsDAO.getProductByIdDao({ _id: pid });
      return product;
    } catch (err) {
      throw new CustomError(`No product of this id found: ${pid}.`, 'ProductNotFoundError');
    }
  }

  async createProductService(productData) {
    try {
      const { title, description, thumbnail, code, category } = productData;
      const price = parseFloat(productData.price);
      const stock = parseInt(productData.stock, 10);
      if (!title || !description || isNaN(price) || !thumbnail || !code || isNaN(stock) || !category) {
        const error = new Error('Validation Error: Wrong format.');
        error.code = EErros.INVALID_TYPES_ERROR;
        error.cause = customErrorMsg.generateProductErrorInfo(productData);
        throw error;
      }
      if (await productsDAO.getProductByCodeDao(code, true)) {
        logger.error('Validation error: Product already exists', { productData });
        return CustomError.createError({
          name: 'Validation Error',
          message: 'Product already exists.',
          code: EErros.PRODUCT_ALREADY_EXISTS,
          cause: customErrorMsg.generateProductoErrorAlredyExists(productData),
        });
      }
      const newProd = await productsDAO.createOneProductDao({ ...productData, price, stock });
      return newProd;
    } catch (error) {
      logger.error(`Error creating product: ${error.message}`, { productData });
      throw new Error(`When creating product: Error creating product: ${error.message}`);
    }
  }
  async searchProductsByTitleService(page, limit, sort, title) {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
      };
      const query = title ? { title: { $regex: new RegExp(title, 'i') } } : {};
      const products = await products.paginate(query, options);
      return products;
    } catch (error) {
      throw error;
    }
  }
  async updateProductService(pid, productData) {
    try {
      const productUpdate = await productsDAO.updateOneProductDao(pid, productData, { new: true });
      return productUpdate;
    } catch (error) {
      throw `Could not modify product. ${error}`;
    }
  }
  async deleteProductService(pid) {
    try {
      const deletedProduct = await productsDAO.deleteOneProductDao(pid);
      return deletedProduct;
    } catch (error) {
      throw new Error(`Failed to delete product with id: ${pid}`);
    }
  }
}

export default ServiceProducts;
