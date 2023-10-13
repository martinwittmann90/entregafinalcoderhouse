import CartsDAO from '../DAO/classes/carts.dao.js';
import CartModel from '../DAO/models/carts.model.js';
import ProductModel from '../DAO/models/products.model.js';
import ServiceProducts from './products.service.js';

const serviceProducts = new ServiceProducts();
const cartsDAO = new CartsDAO();

class ServiceCarts {
  async getAllCartsService() {
    try {
      const carts = await serviceProducts.getAllCartsDao();
      return carts;
    } catch (err) {
      throw new Error(`Error finding all carts`);
    }
  }
  async getCartByIdService(cid) {
    try {
      const cart = await cartsDAO.getCartByIdDao(cid);
      console.log('getCartByIdService', cart);
      if (!cart) {
        throw new Error('Error finding cart.');
      }
      return cart;
    } catch (error) {
      throw new Error('Cart not found by ID');
    }
  }

  async createOneCartService() {
    const cartCreated = await cartsDAO.createCartDao({});
    return { status: 200, result: { status: 'success', payload: cartCreated } };
  }
  async addProductToCartService(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      const product = await ProductModel.findById(pid);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!product) {
        throw new Error('Product not found');
      }
      const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === pid);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1 });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error adding product to cart. ${err}`);
    }
  }

  async updateCartService(cid, cartUpdate) {
    try {
      const updatedCart = await cartsDAO.updateCartDao({ _id: cid }, { products: cartUpdate });
      return updatedCart;
    } catch (error) {
      throw new Error(`Failed to find cart. ${err}`);
    }
  }
  async updateProductQuantityService(cid, pid, quantity) {
    try {
      const cart = await cartsDAO.getCartDao(cid);
      const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error updating product quantity in cart');
    }
  }
  async deleteProductFromCartService(cid, pid, quantityP) {
    try {
      const productToCart = await serviceProducts.getProductByIdService(pid);
      productToCart
        ? productToCart
        : (() => {
            new Error('The product does not exist in the database, please check.');
          })();
      const cart = await CartModel.findById(cid);
      cart
        ? cart
        : (() => {
            throw Error(`No cart with ID ${cid} was found.`);
          })();
      const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);
      productIndex === -1 ? '' : cart.products[productIndex].quantity--;
      quantityP || cart.products[productIndex].quantity == 0 ? (cart.products[productIndex].product == pid ? cart.products.splice(productIndex, 1) : '') : '';
      const updatedCart = await cartsDAO.deleteProductFromCartDao({ _id: cid }, cart);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error deleting product from cart. ${err}`);
    }
  }
  async clearCartService(cid) {
    try {
      const emptyCart = await cartsDAO.emptyCartDao({ _id: cid });
      return emptyCart;
    } catch (error) {
      throw new Error(`Failed to find cart. ${err}`);
    }
  }
}
export default ServiceCarts;
