import express from 'express';
import { mailController, smsController } from '../controller/messages.controller.js';
const messageandmailRouter = express.Router();

messageandmailRouter.get('/mail', async (req, res) => {
  try {
    const response = await mailController.sendMail();
    res.send(response);
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

messageandmailRouter.get('/sms', async (req, res) => {
  try {
    const response = await smsController.sendSms();
    res.send(response);
  } catch (error) {
    res.status(500).send('Error sending SMS');
  }
});

export default messageandmailRouter;
