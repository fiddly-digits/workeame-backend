import { User } from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/auth.utils.js';

const { MODE, REFRESH_KEY } = process.env;

export const register = async (req, res) => {
  const { email, password, name, lastname, photo } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password, name, lastname, photo });
    await user.save();
    //! jwt
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log(error);
    // * 11000 error code is for duplicate key | Possibly making a switch
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese correo electrónico'
      });
    }
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return res.status(403).json({
        success: false,
        message: 'No existe un usuario con ese correo electrónico'
      });

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch)
      return res.status(403).json({
        success: false,
        message: 'Contraseña incorrecta'
      });

    //! jwt
    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.status(200).json({ success: true, token, expiresIn });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: 'Server Error' });
  }
};

export const infoUser = async (req, res) => {
  // ! .lean() to faster requests, but need to cut off mongoose methods
  try {
    const user = await User.findById(req.uid);
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: 'Server Error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie)
      return res
        .status(401)
        .json({ success: false, message: 'Token does not exist' });
    const { uid } = jwt.verify(refreshTokenCookie, REFRESH_KEY);
    const { token, expiresIn } = generateToken(uid);

    return res.status(200).json({ success: true, token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};
