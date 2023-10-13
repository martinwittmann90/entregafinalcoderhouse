import ServiceProducts from '../services/products.service.js';
import CustomError from '../error/customError.js';
import { customErrorMsg } from '../error/customErrorMessage.js';
import EErros from '../error/enum.js';
import { logger } from '../utils/logger.js';
import { mailController } from './messages.controller.js';
const serviceProducts = new ServiceProducts();
import userDTO from '../DAO/DTO/user.dto.js';

class ProductsController {
  async getAllProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;
      const products = await serviceProducts.getAllProductsService(limit, page, sort, query);
      logger.info('Products retrieved');
      return res.status(200).json({
        status: 'success',
        msg: 'Products retrieved',
        payload: products,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ Error: `${err}` });
    }
  }
  async getProductsById(req, res) {
    try {
      const pid = req.params.id;
      const product = await serviceProducts.getProductByIdService(pid);
      if (!product) {
        logger.warning('Product not found');
        return res.status(404).json({
          status: 'error',
          msg: 'Product not found',
        });
      }
      logger.info('Product retrieved');
      return res.status(200).json({
        status: 'success',
        msg: 'Product retrieved',
        payload: product,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(400).json({
        status: 'error',
        msg: error.message,
      });
    }
  }
  async createOneProductMulter(req, res) {
    try {
      logger.info('Create Product Controller Reached');
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const user = req.session.user;
      const productData = req.body;
      if (user.role === 'premium') {
        productData.owner = user.email;
        const filename = req.file.filename;
        productData.thumbnail = filename;
        const createdProduct = await serviceProducts.createProductService(productData);
        return res.status(200).redirect('/realtimeproducts');
      } else {
        return res.status(403).json({
          status: 'error',
          msg: 'Permission denied',
        });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ status: 'error', msg: error.message });
    }
  }

  async updateOneProducts(req, res) {
    try {
      const pid = req.params.id;
      const updatedProduct = req.body;
      const user = req.session.user;
      const existingProduct = await serviceProducts.getProductByIdService(pid);
      if (!existingProduct) {
        return res.status(404).json({
          status: 'error',
          msg: 'Product not found',
        });
      }
      if (user.role === 'admin') {
        const updated = await serviceProducts.updateProductService(pid, updatedProduct);
        if (!updated) {
          return res.status(500).json({
            status: 'error',
            msg: 'Failed to update product',
          });
        }
        return res.status(200).json({
          status: 'success',
          msg: 'Product updated',
          payload: updated,
        });
      } else if (user.role === 'premium' && existingProduct.owner === user.email) {
        const updated = await serviceProducts.updateProductService(productId, updatedProduct);
        if (!updated) {
          return res.status(500).json({
            status: 'error',
            msg: 'Failed to update product',
          });
        }
        return res.status(200).json({
          status: 'success',
          msg: 'Product updated',
          payload: updated,
        });
      } else {
        return res.status(403).json({
          status: 'error',
          msg: 'Permission denied',
        });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ status: 'error', msg: error.message });
    }
  }
  async deleteOneProducts(req, res) {
    try {
      const pid = req.params.id;
      const user = req.session.user;
      const product = await serviceProducts.getProductByIdService(pid);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          msg: 'Product not found',
        });
      }
      if (user.role === 'admin') {
        const deletedProduct = await serviceProducts.deleteProductService(pid);
        if (!deletedProduct) {
          return res.status(404).json({
            status: 'error',
            msg: 'Product not found',
          });
        }
        return res.status(200).json({
          status: 'success',
          msg: 'Product deleted',
          payload: deletedProduct,
        });
      } else if (user.role === 'premium' && product.owner === user.email) {
        const deletedProduct = await serviceProducts.deleteProductService(pid);
        if (!deletedProduct) {
          return res.status(404).json({
            status: 'error',
            msg: 'Product not found',
          });
        }
        await mailController.sendMail({
          to: user.email,
          subject: 'Product deleted',
          text: 'Your product with ID ${pid} has been deleted.',
        });
        return res.status(200).json({
          status: 'success',
          msg: 'Product deleted',
          payload: deletedProduct,
        });
      } else {
        return res.status(403).json({
          status: 'error',
          msg: 'Permission denied',
        });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ status: 'error', msg: error.message });
    }
  }
}

export const productsController = new ProductsController();
