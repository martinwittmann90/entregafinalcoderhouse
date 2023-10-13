import express from 'express';
import TokenController from '../controller/tokens.controller.js';

const tokenController = new TokenController();
const tokensRouter = express.Router();

tokensRouter.get('/forget-password', tokenController.renderForgetPassword);
tokensRouter.post('/forget-password', tokenController.sendPasswordResetEmail);
tokensRouter.get('/reset-password/:token', tokenController.handlePasswordResetFromEmail);
tokensRouter.post('/reset-password', tokenController.postPassword);

export default tokensRouter;
