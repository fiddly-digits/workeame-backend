import express from 'express';
import { login } from '../controllers/user.controller.js';
import {
  validateEmail,
  validatePassword,
  validationHandler
} from '../middlewares/verification.middleware.js';

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

export default router;
