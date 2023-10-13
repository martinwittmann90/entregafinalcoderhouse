import { faker } from '@faker-js/faker';

class ServiceMock {
  async getAllProductsMock() {
    try {
      const products = [];
      const generateProduct = () => {
        return {
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          thumbnail: faker.image.imageUrl(),
          code: faker.random.alphaNumeric(10),
          stock: faker.datatype.number(1000),
          category: faker.commerce.department(),
          status: faker.datatype.boolean(),
        };
      };
      do {
        products.push(generateProduct());
      } while (products.length < 100);
      return { status: 200, result: { status: 'success', payload: products } };
    } catch (error) {
      logger.error(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      };
    }
  }
  constructor() {
    this.carts = [
      {
        _id: 'cart_id_1',
        products: [
          { product: 'product_id_1', quantity: 2 },
          { product: 'product_id_2', quantity: 1 },
        ],
      },
      // Agrega más carritos de ejemplo si es necesario
    ];
  }

  async getProductByIdService(id) {
    // Simula obtener un producto por ID
    const product = {
      _id: id,
      title: 'Sample Product',
      description: 'Product Description',
      price: 100,
      thumbnail: 'product_thumbnail_url',
      code: 'P12345',
      stock: 10,
      category: 'Camisetas',
      status: true,
      owner: 'productowner@example.com',
    };
    return product;
  }

  async addProductToCartService(cid, productId) {
    try {
      const cart = this.carts.find((c) => c._id === cid);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const product = await this.getProductByIdService(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const existingProductIndex = cart.products.findIndex((p) => p.product === productId);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      return cart;
    } catch (error) {
      throw new Error(`Error adding product to cart. ${error}`);
    }
  }
}

export default ServiceMock;
