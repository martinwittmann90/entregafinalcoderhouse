import express from 'express';
import { chatController } from '../controller/chat.controller.js';
import { isLogged, isNotAdmin } from '../middleware/auth.js';
const chatRouter = express.Router();

chatRouter.get('/', isLogged, isNotAdmin, chatController.chat);

export default chatRouter;
