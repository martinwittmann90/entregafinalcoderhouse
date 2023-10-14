import express from 'express';
import TokenController from '../controller/tokens.controller.js';

const tokenController = new TokenController();
const tokensRouter = express.Router();

tokensRouter.get('/forgetpassword', tokenController.renderForgetPassword);
tokensRouter.post('/forgetpassword', tokenController.sendPasswordResetEmail);
tokensRouter.get('/reset-password/:token', tokenController.handlePasswordResetFromEmail);
tokensRouter.post('/reset-password', tokenController.postPassword);

export default tokensRouter;
