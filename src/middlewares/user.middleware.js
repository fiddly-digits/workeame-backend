import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

export const fieldValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // 400 Bad Request
  }
  next();
};

export const requireToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization.split(' ')[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, SECRET_KEY);
    req.uid = decoded.uid;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};
