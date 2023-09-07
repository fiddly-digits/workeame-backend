import jwt from 'jsonwebtoken';

const { SECRET_KEY, MODE } = process.env;

export const generateToken = (uid) => {
  const expiresIn = 60 * 15; // * 15 minutes
  try {
    const token = jwt.sign({ uid }, SECRET_KEY, { expiresIn });
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (uid) => {
  const expiresIn = 60 * 60 * 24 * 30; // * 30 days
  try {
    const refreshToken = jwt.sign({ uid }, SECRET_KEY, { expiresIn });
    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: !(MODE === 'dev'),
      expires: new Date(Date.now() + expiresIn * 1000) // * milliseconds
    });
  } catch (error) {
    console.log(error);
  }
};
