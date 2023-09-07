import express from 'express';
import {
  infoUser,
  login,
  register,
  refreshToken,
  logout
} from '../controllers/auth.controller.js';
import {
  emailValidation,
  passwordValidation
} from '../helpers/user.helpers.js';
import {
  fieldValidation,
  requireToken
} from '../middlewares/user.middleware.js';

const router = express.Router();
router.post(
  '/register',
  emailValidation,
  passwordValidation,
  fieldValidation,
  register
);

router.post('/login', login);

router.get('/protected', requireToken, infoUser);

router.get('/refresh', refreshToken);

router.get('/logout', logout);

export default router;
