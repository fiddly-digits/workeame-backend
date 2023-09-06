import { User } from '../models/User.model.js';
import createError from 'http-errors';

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
export const login = (req, res) => {
  res.json({ ok: 'login' });
};
