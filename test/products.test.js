import chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Products', () => {
  it('should return a list of products', async () => {
    const response = await requester.get('/api/products');
    expect(response.status).to.equal(200);
  });

  it('should create a product with a valid authentication token', async () => {
    const loginResponse = await requester.post('/api/sessions/login', {
      email: 'martinwittmann@hotmail.com',
      password: '123456',
    });
    if (loginResponse.status !== 200) {
      return;
    }
    const token = jwt.sign(
      {
        id: loginResponse.data.user._id,
        email: loginResponse.data.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const response = await requester.post('/api/products').set('Authorization', `Bearer ${token}`).send(productData);
    expect(response.status).to.equal(201);
    done();
  });
  it('should return a product when a valid ID is provided', async () => {
    const productId = '651f38a80ad3fc63337ffacd';
    const response = await requester.get(`/api/products/${productId}`);
    expect(response.status).to.equal(200);
  });
  it('should update a product when a valid ID and product data is provided', async () => {
    const loginResponse = await requester.post('/api/sessions/login', {
      email: 'admin@example.com',
      password: '123456',
    });
    if (loginResponse.status !== 200) {
      return;
    }
    const token = jwt.sign(
      {
        id: loginResponse.data.user._id,
        email: loginResponse.data.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const productId = '1234567890abcdef';
    const updatedProduct = {
      title: 'New name',
      description: 'New Description',
      price: 101,
    };
    const response = await requester.put(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`).send(updatedProduct);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.deep.equal({
      ...updatedProduct,
      _id: productId,
    });
  });
  it('should delete a product when a valid ID is provided', async () => {
    const loginResponse = await requester.post('/api/sessions/login', {
      email: 'admin@example.com',
      password: '123456',
    });
    if (loginResponse.status !== 200) {
      return;
    }
    const token = jwt.sign(
      {
        id: loginResponse.data.user._id,
        email: loginResponse.data.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const productId = '1234567890abcdef';
    const response = await requester.delete(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.deep.equal({
      status: 'success',
      msg: 'Product deleted',
    });
  });
});
