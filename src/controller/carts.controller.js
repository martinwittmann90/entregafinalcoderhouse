import { logger } from '../utils/logger.js';
import ServiceCarts from '../services/carts.service.js';
import ServiceProducts from '../services/products.service.js';
const serviceCarts = new ServiceCarts();
const serviceProducts = new ServiceProducts();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await serviceCarts.createOneCartService({});
      logger.info('New cart created:', newCart);
      res.status(201).json(newCart);
    } catch (error) {
      logger.error('Error creating cart:', error);
      res.status(500).json({ status: 'error', message: `Error creating cart. ${error}` });
    }
  }
  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await serviceCarts.getCartByIdService(cid);
      const user = req.session.user;
      const userCartId = user.cartID;
      const session = req.session.user;
      const simplifiedCart = cart.cartProducts.map((item) => {
        if (item.product) {
          return {
            title: item.product.title,
            price: item.product.price,
            _id: item.product._id,
            quantity: item.quantity,
          };
        }
        return null;
      });
      res.render('carts', { cart: simplifiedCart, userCartId, session });
    } catch (error) {
      logger.error(error, { cart: simplifiedCart, userCartId });
      next(error);
    }
  }
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const user = req.session.user;
      const product = await serviceProducts.getProductByIdService(pid);
      if (user.role === 'premium' && product.owner === user.email) {
        return res.status(403).json({
          status: 'error',
          message: 'Permission denied: Cannot add your own product to cart',
        });
      }
      const cart = await serviceCarts.addProductToCartService(cid, pid);
      logger.info(`Product ${pid} added to cart ${cid}`);
      res.status(200).json(cart);
    } catch (err) {
      logger.error('Error adding product to cart:', err);
      res.status(404).json({ status: 'error', message: ` Error adding product to cart${err}` });
    }
  }
  async deletOneProductFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const pQuantity = req.body.quantity;
      const cart = await serviceCarts.deleteProductFromCartService(cid, pid, pQuantity);
      logger.info(`Product ${pid} deleted from cart ${cid}:`, cart);
      res.status(200).json({ status: 'success', message: 'Product removed from cart', cart });
    } catch (err) {
      logger.error('Error deleting product from cart:', err);
      res.status(500).json({ status: 'error', message: `Internal server error. ${err}` });
    }
  }
  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await serviceCarts.updateCartService(cid, products);
      logger.info(`Cart ${cid} updated:`, cart);
      res.status(200).json({ status: 'success', message: 'Cart updated successfully', cart });
    } catch (err) {
      logger.error('Error updating cart:', err);
      res.status(500).json({ status: 'error', message: `Internal server error. ${err}` });
    }
  }
  async updateProductQuantityFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await serviceCarts.updateProductQuantityService(cid, pid, quantity);
      logger.info(`Product ${pid} quantity updated in cart ${cid}:`, cart);
      res.status(200).json({ status: 'success', message: 'Product quantity updated', cart });
    } catch (err) {
      logger.error('Error updating product quantity:', err);
      res.status(500).json({ status: 'error', message: `Internal server error. ${err}` });
    }
  }
  async clearCart(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await serviceCarts.clearCartService(cid);
      logger.info(`Clearing cart ${cid}`);
      res.status(200).json(cart);
    } catch (err) {
      logger.error('Error clearing cart:', err);
      res.status(404).json({ Error: `${err}` });
    }
  }
}
export default CartController;
