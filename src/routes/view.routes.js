import express from 'express';
import { viewsController } from '../controller/views.controller.js';
import { isAdminOrPremium, isLogged } from '../middleware/auth.js';

const viewsRouter = express.Router();

viewsRouter.get('/', viewsController.renderHome);
viewsRouter.get('/products', viewsController.renderAllProducts);
viewsRouter.get('/products/filter', viewsController.renderFilteredProducts);
viewsRouter.get('/realtimeproducts', isLogged, isAdminOrPremium, viewsController.renderRealTimeProducts);
viewsRouter.get('/products/:pid', viewsController.renderOneProduct);
viewsRouter.get('/loggerTest', viewsController.testLogger);

export default viewsRouter;
