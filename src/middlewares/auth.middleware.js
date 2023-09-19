import jwt from 'jsonwebtoken';
import createError from 'http-errors';
const { SECRET_KEY } = process.env;

export const auth = async (req, res, next) => {
  try {
    console.log(req.path);
    const authorization = req.headers.authorization || '';
    const token = authorization.split(' ')[1];
    const isVerified = jwt.verify(token, SECRET_KEY);
    // if (!isVerified) throw createError(401, 'Unauthorized');
    //if (isVerified.id !== req.params.id) throw createError(401, 'Unauthorized');
    req.verifiedID = isVerified.id;
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

// ! Auth Service, evaluate if it's necessary or we can rewrite original auth middleware and dependencies
export const authService = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';
    if (!authorization) throw createError(401, 'Unauthorized');
    const token = authorization.split(' ')[1];
    const isVerified = jwt.verify(token, SECRET_KEY);
    if (!isVerified) throw createError(401, 'Unauthorized');
    if (Object.keys(req.params).length !== 0) {
      if (isVerified.id !== req.params.id)
        throw createError(401, 'Unauthorized');
      req.verifiedID = isVerified.id;
    } else if (Object.keys(req.query).length === 0) {
      req.verifiedID = isVerified.id;
    }
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

// ! Original Auth Middleware
// export const auth = async (req, res, next) => {
//   try {
//     const authorization = req.headers.authorization || '';
//     if (!authorization) throw createError(401, 'Unauthorized');
//     const token = authorization.split(' ')[1];
//     const isVerified = jwt.verify(token, SECRET_KEY);
//     if (!isVerified) throw createError(401, 'Unauthorized');
//     if (isVerified.id !== req.params.id) throw createError(401, 'Unauthorized');
//     req.verifiedID = isVerified.id;
//     next();
//   } catch (error) {
//     res
//       .status(error.status || 500)
//       .json({ success: false, message: error.message });
//   }
// };
