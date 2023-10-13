import ServiceMock from '../services/mocks.service.js';
const serviceMock = new ServiceMock();

class MockController {
  async getMockingProducts(req, res) {
    try {
      const response = await serviceMock.getAllProductsMock();
      return res.status(response.status).json(response.result, null, 1000);
    } catch (err) {
      console.error('Error getMockingProducts:', err);
      res.status(500).json('Error getMockingProducts');
    }
  }
  constructor() {
    this.cart = {
      products: [
        { product: 'product_id_1', quantity: 2 },
        { product: 'product_id_2', quantity: 1 },
      ],
    };
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const user = { role: 'premium', email: 'test@example.com' };
      const product = {
        _id: pid,
        owner: 'productowner@example.com',
      };
      if (user.role === 'premium' && product.owner === user.email) {
        return res.status(403).json({
          status: 'error',
          message: 'Permission denied: Cannot add your own product to cart',
        });
      }
      this.cart.products.push({ product: pid, quantity: 1 });
      res.status(200).json(this.cart);
    } catch (err) {
      res.status(404).json({ status: 'error', message: `Error adding product to cart${err}` });
    }
  }
}

export default MockController;
