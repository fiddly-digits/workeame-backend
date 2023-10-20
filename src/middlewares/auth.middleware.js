import jwt from 'jsonwebtoken';
import createError from 'http-errors';
const { SECRET_KEY } = process.env;

export const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.split(' ')[1];
    const isVerified = jwt.verify(token, SECRET_KEY);
    if (!isVerified) throw createError(401, 'Unauthorized');
    //if (isVerified.id !== req.params.id) throw createError(401, 'Unauthorized');
    req.verifiedID = isVerified.id;
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};
