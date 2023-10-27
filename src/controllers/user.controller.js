import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Token } from '../models/token.model.js';
import createError from 'http-errors';
import crypto from 'crypto';
import { sendMail } from '../utils/mailsender.util.js';

const { SECRET_KEY } = process.env;

// * Register user
export const register = async (data, file) => {
  if (!file) throw createError(400, 'Missing Photo');
  let user = await User.findOne({ email: data.email });
  if (user) throw createError(400, 'Email already registered');

  data.photo = file.location;

  user = await User.create(data);

  const token = await Token.create({
    user: user._id,
    token: crypto.randomBytes(16).toString('hex')
  });

  const text = `Hola ${user.name},\n\nPor favor verifica tu cuenta haciendo click en el siguiente link: \n\nhttp:\/\/workea.me\/verify/${token.token}\n\n y confirma el email que registraste con nosotros \n\n gracias por unirte a Workea`;
  sendMail(user.email, text);
  return user;
};

// * Login user
export const login = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw createError(404, 'User not found');
  if (!user.isVerified)
    throw createError(403, 'User not verified, please verify your mail');

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) throw createError(400, 'Invalid credentials');

  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: 5 * 60 * 60 // 5 hours
  });
  return token;
};

// * Get all Worker users

export const getAllWorkers = async () => {
  const users = await User.find({ type: 'worker' }).populate('Services');
  return users;
};

// * Get user by id

export const getOne = async (id) => {
  const user = await User.findById(id);
  createError(404, 'User not found');
  return user;
};

// * Update Profile for completion
export const completeProfile = async (id, data) => {
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is skippable
  if (user.isProfileComplete)
    throw createError(403, 'Profile already completed');

  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');
  const isCURPRepeated = await User.exists({ CURP: data.CURP });
  if (isCURPRepeated) throw createError(400, 'CURP already registered');

  if (
    !data.address.street ||
    !data.address.locality ||
    !data.address.municipality ||
    !data.address.state ||
    !data.address.country ||
    !data.address.postCode ||
    !data.phone ||
    !data.CURP ||
    !data.type
  )
    throw createError(400, 'Missing essential data');

  if (data.type === 'user' && (data.category || data.expertise))
    throw createError(400, 'User cannot have category nor expertise');

  if (data.type === 'worker' && (!data.category || !data.expertise))
    throw createError(400, 'Worker must have category and expertise');

  user = await User.findOne({ phone: data.phone });
  if (user && user.id !== id)
    throw createError(400, 'Phone number already registered');

  data.isProfileComplete = true;

  const userCompleted = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return userCompleted;
};

export const update = async (id, data, file) => {
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is skippable
  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');

  if (data.type === 'user' && (data.category || data.expertise))
    throw createError(400, 'User cannot have category nor expertise');

  if (data.type === 'worker' && (!data.category || !data.expertise))
    throw createError(400, 'Worker must have category and expertise');

  if (data.phone) {
    user = await User.findOne({ phone: data.phone });
    console.log(user);
    if (user && user.id !== id)
      throw createError(403, 'Phone number already registered');
  }

  user = await User.findById(id);
  if (!user) throw createError(404, 'User not found');

  if (file) {
    data.photo = file.location;
  }

  if (data.address) {
    data.address.street = !data.address.street
      ? user.address.street
      : data.address.street;
    data.address.locality = !data.address.locality
      ? user.address.locality
      : data.address.locality;
    data.address.municipality = !data.address.municipality
      ? user.address.municipality
      : data.address.municipality;
    data.address.state = !data.address.state
      ? user.address.state
      : data.address.state;
    data.address.country = !data.address.country
      ? user.address.country
      : data.address.country;
    data.address.postCode = !data.address.postCode
      ? user.address.postCode
      : data.address.postCode;
  }

  const userUpdated = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return userUpdated;
};

// * Update to worker type
export const updateToWorker = async (id, data) => {
  const user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is skippable
  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');
  if (user.type === 'worker') throw createError(400, 'User already a Worker');

  if (!data.category || !data.expertise || !data.CLABE)
    throw createError(400, 'Worker must have category, expertise, and CLABE');

  // user = User.findById(id);

  const worker = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return worker;
};

// * Update mail
export const updateMail = async (id, data) => {
  if (Object.keys(data).length !== 1) throw createError(403, 'Forbidden');
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is skippable
  user = await User.findOne({ email: data.email });
  if (user && user.id !== id)
    throw createError(400, 'Email already registered');

  user = await User.findById(id);
  if (!user) throw createError(404, 'User not found');

  if (data.email === user.email)
    throw createError(400, 'You already have that email');

  const userWithNewMail = await User.findByIdAndUpdate(
    id,
    { email: data.email, isVerified: false },
    {
      returnDocument: 'after'
    }
  );

  let token = await Token.exists({ user: user._id });
  if (!token) {
    token = await Token.create({
      user: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });
  } else {
    token = await Token.findOneAndUpdate(
      { user: user._id },
      { token: crypto.randomBytes(16).toString('hex') },
      { returnDocument: 'after' }
    );
  }

  const text = `Hola ${user.name},\n\nPor favor verifica tu cuenta haciendo click en el siguiente link: \n\nhttp:\/\/workea.me\/verify/${token.token}\n\n y confirma el email que registraste con nosotros \n\n gracias por unirte a Workea`;
  sendMail(userWithNewMail.email, text);
  return userWithNewMail;
};

// * Update Password
export const updatePassword = async (id, data) => {
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is skippable
  if (!user) throw createError(404, 'User not found');

  const isMatch = await user.comparePassword(data.oldPassword);
  if (!isMatch) throw createError(400, 'Invalid Password');

  user = await User.findByIdAndUpdate(
    id,
    { password: data.newPassword },
    { returnDocument: 'after' }
  );
  return user;
};

// * Delete User
export const remove = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw createError(404, 'User not found');
  return user;
};

export const verificationMail = async (verificationToken, email) => {
  const token = await Token.findOne({ token: verificationToken });
  if (!token)
    throw createError(
      400,
      'We were unable to find a valid token. Your token my have expired.'
    );
  const user = await User.findOne({ _id: token.user, email: email });
  if (!user)
    throw createError(400, 'We were unable to find a user for this token.');
  if (user.isVerified)
    throw createError(400, 'This user has already been verified.');
  user.isVerified = true;
  await user.save();
  return user;
};

export const resendVerificationMail = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) throw createError(404, 'User not found');
  if (user.isVerified)
    throw createError(400, 'This account has already been verified.');

  let token = await Token.exists({ user: user._id });
  if (!token) {
    token = await Token.create({
      user: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });
  } else {
    token = await Token.findOneAndUpdate(
      { user: user._id },
      { token: crypto.randomBytes(16).toString('hex') },
      { returnDocument: 'after' }
    );
  }
  //if (!token) throw createError(404, 'Token not found');
  const text = `Hola ${user.name},\n\nPor favor verifica tu cuenta haciendo click en el siguiente link: \n\nhttp:\/\/workea.me\/confirmation/${token.token}\n\n y confirma el email que registraste con nosotros \n\n gracias por unirte a Workea`;
  sendMail(user.email, text);

  return user;
};

// * Request password reset
export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found');

  const token = await Token.create({
    user: user._id,
    token: crypto.randomBytes(16).toString('hex'),
    type: 'reset'
  });

  const text = `Hola ${user.name},\n\nPara restablecer tu contraseña, haz click en el siguiente link: \n\nhttp:\/\/workea.me\/reset-password/${token.token}\n\nEste link expira en 24 horas.\n\nGracias por usar Workea`;
  sendMail(user.email, text, 'Workea.me: Restablecer contraseña');
  return user.email;
};

// * Reset password
export const resetPassword = async (token, password) => {
  const resetToken = await Token.findOne({
    token,
    type: 'reset'
  }).populate('user');
  if (!resetToken) throw createError(400, 'Invalid or expired token');

  const user = resetToken.user;
  const isMatch = await user.comparePassword(password);
  if (isMatch) throw createError(400, 'Invalid Password');
  user.password = password;
  await user.save();
  const text = `Hola ${user.name},\n\n Tu password ha sido cambiado, si tu no has hecho este cambio, comunícate con nosotros a contacto@workea.me\n\nGracias por usar Workea`;
  sendMail(user.email, text, 'Workea.me: Tu password ha sido cambiado');
};
