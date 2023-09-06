import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import {
  emailValidation,
  passwordValidation
} from '../helpers/user.helpers.js';
import { fieldValidation } from '../middlewares/user.middleware.js';

const router = express.Router();
router.post(
  '/register',
  emailValidation,
  passwordValidation,
  fieldValidation,
  register
);

router.post('/login', login);

export default router;
