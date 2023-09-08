import createError from 'http-errors';
import jwt from 'jsonwebtoken';
const { SECRET_KEY, REFRESH_KEY } = process.env;

export const auth = async (req, res, next) => {
  try {
    const authorization = req.headers?.authorization;
    if (!authorization) throw createError(401, 'Token does not exist');
    const token = authorization.split(' ')[1];
    const { uid } = jwt.verify(token, SECRET_KEY);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshCookie = req.cookies.refreshToken;
    if (!refreshCookie) throw createError(401, 'Token does not exist');

    const { uid } = jwt.verify(refreshCookie, REFRESH_KEY);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};
