import express from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';
import { fieldValidation } from '../middlewares/user.middleware.js';

const router = express.Router();
router.post(
  '/register',
  [
    body('email', 'Formato de Email no valido')
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres')
      .trim()
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        } else {
          return value;
        }
      })
  ],
  fieldValidation,
  register
);

router.post('/login', login);

export default router;
