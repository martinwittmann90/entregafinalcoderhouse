import dotenv from 'dotenv';
import fetch from 'node-fetch';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import UserModel from '../DAO/models/users.model.js';
import { compareHash, createHash } from '../utils/bcrypt.js';
import TokenService from '../services/tokens.service.js';
import { logger } from '../utils/logger.js';
import config from './envconfig.js';
dotenv.config();
const tokenService = new TokenService();
const localStrategy = local.Strategy;

import ServiceCarts from '../services/carts.service.js';
const serviceCarts = new ServiceCarts();

import CartController from '../controller/carts.controller.js';
const cartController = new CartController();

export default function initPassport() {
  passport.use(
    'register',
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          if (!email || !firstName || !lastName || !age || !password) {
            logger.error('Campos incompletos en la solicitud de registro');
            return done(null, false);
          }
          let user = await UserModel.findOne({ email: username });
          if (user) {
            logger.info('User already exists', { user: user });
            return done(null, false);
          }
          const newCart = await serviceCarts.createOneCartService();
          const cartID = newCart.result.payload._id.toString();
          const newUser = new UserModel({
            email: email,
            firstName: firstName,
            lastName: lastName,
            age: Number(age),
            role: 'user',
            password: createHash(password),
            cartID: cartID,
          });
          await newUser.save();
          logger.info('User Registration successful', { user: newUser });
          return done(null, newUser);
        } catch (error) {
          logger.error('Error in register', { error: error });
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ email: username });
        if (!user) {
          logger.info('User Not Found with username (email)', { email: username });
          return done(null, false);
        }
        if (!compareHash(password, user.password)) {
          logger.info('Invalid Password');
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.use(
    'forgotPassword',
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email } = req.body;
          const user = await UserModel.findOne({ email });
          if (!user) {
            logger.info('User Not Found with email', { email });
            return done(null, false, { message: 'User not found' });
          }
          const token = await tokenService.generateToken(user._id);
          await tokenService.sendPasswordResetEmail(email, token);
          logger.info('Password reset email sent to', { email });
          return done(null, user);
        } catch (error) {
          logger.error('Error in forgotPassword', { error });
          return done(error);
        }
      }
    )
  );
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        githubcallbackURL: config.githubcallbackURL,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);
          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;
          logger.info('GitHub profile:', { profile });
          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newCart = await serviceCarts.createOneCartService();
            const cartID = newCart.result.payload._id.toString();
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: null,
              age: 18,
              role: 'user',
              password: null,
              cartID: cartID,
            };
            user = await UserModel.create(newUser);
            logger.info('User Registration successful');
          }
          return done(null, user);
        } catch (e) {
          logger.error('Error in Auth GitHub!', { error: e });
          return done(e);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
