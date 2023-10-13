import userDTO from '../DAO/DTO/user.dto.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

class AuthController {
  async renderLogin(req, res) {
    try {
      logger.debug('Rendering login page');
      return res.render('login', {});
    } catch (error) {
      res.status(500).send('Error rendering login.');
    }
  }
  async login(req, res) {
    try {
      if (!req.user) {
        logger.error('Invalid login attempt: Invalid Credentials');
        req.session.user = {
          _id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
          age: req.user.age,
          cartID: req.user.cartID,
        };
        return res.status(400).json({ error: 'Invalid Credentials' });
      }
      req.user.last_connection = Date.now();
      await req.user.save();
      const { _id, email, firstName, lastName, age, role, cartID } = req.user;
      req.session.user = { _id, email, firstName, lastName, age, role, cartID };
      logger.info('User logged in successfully', req.user);
      return res.status(200).json({ status: 'success', message: 'User logged in successfully', payload: req.user });
    } catch (error) {
      res.status(500).json({ error: 'Error when trying to log in' });
    }
  }
  async register(req, res) {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      age: req.user.age,
      cartID: req.user.cartID,
    };
    logger.info('User created successfully', req.user);
    return res.status(201).json({ status: 'success', message: 'User created successfully', payload: req.user });
  }
  async failRegister(req, res) {
    logger.error('Error adding user during registration');
    return res.status(400).json({ status: 'error', message: 'Error adding user' });
  }
  async failLogin(req, res) {
    logger.error('Wrong user or password during login attempt');
    return res.status(400).json({ status: 'error', message: 'Wrong user or password' });
  }
  async logout(req, res) {
    try {
      req.session.destroy((error) => {
        if (error) {
          console.error('Error al cerrar la sesión:', error);
          return res.status(500).json({ status: 'error', message: "Error! Couldn't logout!" });
        }
        req.user.last_connection = Date.now();
        req.user.save();
        res.clearCookie('connect.sid');
        logger.info('User logged out successfully');
        return res.status(200).json({ status: 'success', message: 'Logout successfully!' });
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  }
  async renderRegister(req, res) {
    logger.debug('Rendering register page');
    return res.render('register', {});
  }
  async registerGithub(req, res) {
    req.session.user = req.user;
    logger.info('User registered through GitHub and redirected to products');
    res.redirect('/products');
  }
  async getCurrent(req, res) {
    try {
      const userDto = new userDTO(req.session.user);
      const user = req.user;
      const sessionUser = req.session.user;
      const context = {
        user: user,
        sessionUser: sessionUser,
        userDto: userDto,
      };
      return res.render('profile', context);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error rendering current session');
    }
  }
}

export default AuthController;
