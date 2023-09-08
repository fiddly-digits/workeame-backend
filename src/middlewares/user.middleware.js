import { validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';

const { SECRET_KEY, REFRESH_KEY } = process.env;

// * validate params for scripts
export const fieldValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((error) => error.msg)
    }); // 400 Bad Request
  }
  next();
};

// * validate params for password and email registration
export const userDataValidator = [
  body('email', 'Email format not valid').trim().isEmail(),
  body('password', 'password must be at least 8 characters long')
    .trim()
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
      const numberRegex = /[0-9]/;
      const upperCaseRegex = /[A-Z]/;
      if (!upperCaseRegex.test(value))
        throw new Error('password must contain at least one uppercase letter');
      if (!numberRegex.test(value))
        throw new Error('password must contain at least one number');
      if (!specialCharacterRegex.test(value))
        throw new Error('password must contain at least one special character');
      return value;
    }),
  fieldValidation
];

export const mailValidator = [
  body('email', 'Email format not valid').trim().isEmail(),
  fieldValidation
];
