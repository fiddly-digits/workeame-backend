import express from 'express';
import {
  login,
  verificationMail,
  resendVerificationMail
} from '../controllers/user.controller.js';
import {
  validateEmail,
  validatePassword,
  validationHandler
} from '../middlewares/verification.middleware.js';
import createError from 'http-errors';

const router = express.Router();

router.post(
  '/login',
  [validateEmail, validatePassword],
  validationHandler,
  async (req, res) => {
    try {
      const token = await login(req.body);
      if (!token) throw createError(400, 'Error creating token');
      res.status(200).json({ success: true, message: 'User logged in', token });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

router.post('/confirmation/:token', async (req, res) => {
  try {
    const verifiedUser = await verificationMail(
      req.params.token,
      req.body.email
    );
    if (!verifiedUser) throw createError(400, 'Error verifying user');
    res.status(200).json({
      success: true,
      message: 'The account has been verified. Please log in.'
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.post('/resend', async (req, res) => {
  try {
    const user = await resendVerificationMail(req.body.email);
    res.status(200).json({
      success: true,
      message: 'A verification email has been sent to ' + user.email + '.'
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
