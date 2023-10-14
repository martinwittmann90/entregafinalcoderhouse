import supertest from 'supertest';
import chai from 'chai';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

let cartID = '65286f18af18102731556196';
const cid = '65286f18af18102731556196';
const pid = '651f38a80ad3fc63337ffacd';

before(async function loginUser() {
  const loginCredentials = {
    email: 'prueba@prueba.com',
    password: '123',
  };
  const res = await requester.post('/auth/profile/login').send(loginCredentials);
});

describe('Carts', () => {
  it('should update a cart', async () => {
    const updatedCartData = {
      products: [
        {
          product: '651f38a80ad3fc63337ffacd',
          quantity: 2,
        },
        {
          product: '651f38f00ad3fc63337ffad6',
          quantity: 2,
        },
      ],
    };
    const response = await requester.put(`/api/carts/${cartID}`).send(updatedCartData);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const { status, _body } = response;
    expect(status).to.equal(200);
    expect(_body.message).to.have.eql('Cart updated successfully');
    expect(_body.cart).to.have.property('_id');
  });
  it('should empty a cart', async () => {
    const emptyCart = {
      products: [],
    };
    const response = await requester.put(`/api/carts/${cartID}`).send(emptyCart);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const { status, _body } = response;
    expect(status).to.equal(200);
    expect(_body.message).to.have.eql('Cart updated successfully');
    expect(_body.cart).to.have.property('_id');
  });
  it('should delete a product from a cart successfully', async () => {
    const response = await requester.delete(`/api/carts/${cid}/product/${pid}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('message', 'Product removed from cart');
    expect(response.body).to.have.property('cart');
    // Verifica que el producto se haya eliminado del carrito
    const updatedCart = response.body.cart;
    const productIndex = updatedCart.products.findIndex((p) => p.product.toString() === pid);
    expect(productIndex).to.equal(-1);
  });

  it('should return an error if the product does not exist in the database', async () => {
    const nonExistentProductId = '651f38a80ad3fc63337ffac0';
    const response = await requester.delete(`/api/carts/${cid}/product/${nonExistentProductId}`);
    expect(response.status).to.equal(404);
  });

  it('should return an error if the cart does not exist in the database', async () => {
    const nonExistentCartId = '65286f18af18102731556197';
    const response = await requester.delete(`/api/carts/${nonExistentCartId}/product/${pid}`);
    expect(response.status).to.equal(404);
  });
});
