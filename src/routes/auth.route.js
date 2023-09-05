import express from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
  '/login',
  [body('email', 'Formato de Email no valido').isEmail().normalizeEmail()],
  login
);
router.post('/register', register);

export default router;
