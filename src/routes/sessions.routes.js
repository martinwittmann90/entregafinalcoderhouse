import express from 'express';
import passport from 'passport';
import AuthController from '../controller/session.controller.js';
const authController = new AuthController();

const sessionsRouter = express.Router();

sessionsRouter.get('/login', authController.renderLogin);
sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), authController.login);
sessionsRouter.get('/logout', authController.logout);
sessionsRouter.post('/register', passport.authenticate('register', { failureRedirect: 'failRegister' }), authController.register);
sessionsRouter.get('/failregister', authController.failRegister);
sessionsRouter.get('/faillogin', authController.failLogin);
sessionsRouter.get('/register', authController.renderRegister);
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionsRouter.get('/current', authController.getCurrent);

export default sessionsRouter;
