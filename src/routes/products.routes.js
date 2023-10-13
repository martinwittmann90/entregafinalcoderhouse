import express from 'express';
import { productsController } from '../controller/products.controller.js';
import { checkProductPermissions } from '../middleware/auth.js';
import { uploader } from '../middleware/multer.js';
export const productsRouter = express.Router();

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:id', productsController.getProductsById);
productsRouter.post('/', uploader.single('thumbnail'), productsController.createOneProductMulter);
productsRouter.put('/:id', checkProductPermissions, productsController.updateOneProducts);
productsRouter.delete('/:id', checkProductPermissions, productsController.deleteOneProducts);

export default productsRouter;
