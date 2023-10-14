import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Sessions', () => {
  it('should render the login page', async () => {
    const res = await requester.get('/auth/profile/login');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
  });
  it('should be able to log in', async () => {
    const loginCredentials = {
      email: 'martinwittmann@hotmail.com',
      password: '123',
    };
    const res = await requester.post('/auth/profile/login').send(loginCredentials).expect(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('message', 'User logged in successfully');
    expect(res.body).to.have.property('payload').to.be.an('object');
  });
  it('should handle invalid login attempts', async () => {
    const invalidCredentials = {
      email: 'correo_invalido@ejemplo.com',
      password: 'contraseña_invalida',
    };
    const res = await requester.post('/auth/profile/login').send(invalidCredentials).expect(302);
  });
  it('should render the register page', async () => {
    const res = await requester.get('/auth/profile/register');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
  });
  it('you should register a new user successfully', async () => {
    const newUser = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      age: 30,
      email: 'nuevo@usuario.com',
      password: 'contraseña',
    };
    const res = await requester.post('/auth/profile/register').send(newUser);
    expect(res.status).to.equal(201);
  });
  it('should handle missing fields in record', async () => {
    const incompleteUser = {
      email: 'incompleto@usuario.com',
    };
    const res = await requester.post('/auth/profile/register').send(incompleteUser);
    expect(res.status).to.equal(302);
  });
});
