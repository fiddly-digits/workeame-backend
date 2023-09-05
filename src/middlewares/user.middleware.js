import { validationResult } from 'express-validator';

export const fieldValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // 400 Bad Request
  }
  next();
};
