import { body } from 'express-validator';

//! Move it to middlewares

export const emailValidation = body('email', 'Formato de Email no valido')
  .trim()
  .isEmail()
  .normalizeEmail();
export const passwordValidation = body(
  'password',
  'La contraseña debe tener al menos 6 caracteres'
)
  .trim()
  .isLength({ min: 6 });
