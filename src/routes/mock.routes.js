import express from 'express';
import MockController from '../controller/mock.controller.js';
const mockRouter = express.Router();
const mockController = new MockController();

mockRouter.get('/mockingproducts', mockController.getMockingProducts);

export default mockRouter;
