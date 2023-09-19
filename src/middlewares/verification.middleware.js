import { validationResult, body } from 'express-validator';

// * Validation Handler
export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: errors.array().map((err) => err.msg) }); // TODO: Just send one error message to evaluate in client in production
  next();
};

export let validateEmail = body('email', 'Invalid email').trim().isEmail();
export let validatePassword = body('password', 'Invalid password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/)
  .withMessage('Password must contain at least one special character');

export let validateNewPassword = body('newPassword', 'Invalid password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/)
  .withMessage('Password must contain at least one special character');
