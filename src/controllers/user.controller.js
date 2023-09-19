import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import createError from 'http-errors';

const { SECRET_KEY } = process.env;

// * Register user
export const register = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (user) throw createError(400, 'Email already registered');
  user = await User.create(data);
  return user;
};

// * Login user
export const login = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw createError(404, 'User not found');

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) throw createError(400, 'Invalid credentials');

  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: 90 * 60 // 90 minutes
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
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is omitible
  if (user.isProfileComplete)
    throw createError(403, 'Profile already completed');

  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');

  if (
    !data.address.street ||
    !data.address.city ||
    !data.address.country ||
    !data.address.postCode ||
    !data.phone ||
    !data.documentPhoto ||
    !data.type
  )
    throw createError(400, 'Missing essential data');

  if (data.type === 'user' && (data.category || data.expYears))
    throw createError(400, 'User cannot have category nor expYears');

  if (data.type === 'worker' && (!data.category || !data.expYears))
    throw createError(400, 'Worker must have category and expYears');

  user = await User.findOne({ phone: data.phone });
  if (user && user.id !== id)
    throw createError(400, 'Phone number already registered');

  data.isProfileComplete = true;

  const userCompleted = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return userCompleted;
};

export const update = async (id, data) => {
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is omitibl
  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');

  if (data.type === 'user' && (data.category || data.expYears))
    throw createError(400, 'User cannot have category nor expYears');

  if (data.type === 'worker' && (!data.category || !data.expYears))
    throw createError(400, 'Worker must have category and expYears');

  user = await User.findOne({ phone: data.phone });
  if (user && user.id !== id)
    throw createError(400, 'Phone number already registered');

  user = await User.findById(id);
  if (!user) throw createError(404, 'User not found');

  data.address.city = !data.address.city
    ? user.address.city
    : data.address.city;
  data.address.country = !data.address.country
    ? user.address.country
    : data.address.country;
  data.address.postCode = !data.address.postCode
    ? user.address.postCode
    : data.address.postCode;
  data.address.street = !data.address.street
    ? user.address.street
    : data.address.street;

  const userUpdated = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return userUpdated;
};

// * Update to worker type
export const updateToWorker = async (id, data) => {
  const user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is omitibl
  if (data['email'] || data['password']) throw createError(401, 'Unauthorized');
  if (user.type === 'worker') throw createError(400, 'User already a Worker');

  if (!data.category || !data.expYears)
    throw createError(400, 'Worker must have category and expYears');

  // user = User.findById(id);

  const worker = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return worker;
};

// * Update mail
export const updateMail = async (id, data) => {
  // !Validate that they cannot update anything else than email here
  let user = await User.findById(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is omitibl
  user = await User.findOne({ email: data.email });
  if (user && user.id !== id)
    throw createError(400, 'Email already registered');
  // ! Mail verification goes here

  user = await User.findById(id);
  if (!user) throw createError(404, 'User not found');

  const userWithNewMail = await User.findByIdAndUpdate(
    id,
    { email: data.email, isVerified: false },
    {
      returnDocument: 'after'
    }
  );
  return userWithNewMail;
};

// * Update Password
export const updatePassword = async (id, data) => {
  let user = await User.findById(id);
  console.log(id);
  if (user.id !== id) throw createError(401, 'Unauthorized'); // ! I think this validation is omitibl
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
// TODO: Delete all user data including microsites, services, etc
export const remove = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw createError(404, 'User not found');
  return user;
};
