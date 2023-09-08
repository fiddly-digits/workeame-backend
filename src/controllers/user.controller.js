import { User } from '../models/User.model.js';
import createError from 'http-errors';
import { generateToken, generateRefreshToken } from '../utils/auth.utils.js';

export const register = async (data) => {
  const { email, password, name, lastName, photo } = data;
  let user = await User.findOne({ email });
  if (user) throw createError(400, 'User already exists');

  // TODO: Photo Validation

  user = new User({ email, password, name, lastName, photo });
  await user.save();
  return user;
};

export const login = async (data, res) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw createError(403, 'User not found');
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) throw createError(403, 'Incorrect password');

  // ! jwt
  const tokenData = generateToken(user.id);
  generateRefreshToken(user.id, res);

  return tokenData;
};

export const remove = async (uid) => {
  const user = await User.findByIdAndDelete(uid);
  return user;
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};
