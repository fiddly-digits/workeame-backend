import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
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
    expiresIn: 1000 * 60 * 60 * 5
  });
  return token;
};

// * Get all users

export const getAll = async () => {
  const users = await User.find();
  return users;
};

// * Get user by id

export const getOne = async (id) => {
  const user = await User.findById(id);
  createError(404, 'User not found');
  return user;
};

// * Update Profile for completion

export const updateProfile = async (id, loggedID, data) => {
  if (id !== loggedID) throw createError(401, 'Unauthorized');

  if (data['email'] || data['password'])
    throw createError(401, 'Email and password cannot be updated here');

  if (!data.address || !data.phone || !data.documentPhoto || !data.type)
    throw createError(400, 'Missing essential data');

  if (data.type === 'user' && (data.category || data.expYears))
    throw createError(400, 'User cannot have category nor expYears');

  if (data.type === 'worker' && (!data.category || !data.expYears))
    throw createError(400, 'Worker must have category and expYears');

  const { address, phone, documentPhoto, category, expYears, type } = data;
  const { street, city, postCode, country } = address;
  let user = await User.findOne({ phone });
  if (user) throw createError(400, 'Phone number already registered');
  user = await User.findById(id);
  if (!user) throw createError(404, 'User not found');
  user.address.street = !street ? user.address.street : street;
  user.address.city = !city ? user.address.city : city;
  user.address.postCode = !postCode ? user.address.postCode : postCode;
  user.address.country = !country ? user.address.country : country;
  user.phone = !phone ? user.phone : phone;
  user.documentPhoto = !documentPhoto ? user.documentPhoto : documentPhoto;
  user.type = !type ? user.type : type;
  user.category = !category ? user.category : category;
  user.expYears = !expYears ? user.expYears : expYears;
  user.isProfileComplete = true;

  const userCompleted = await User.findByIdAndUpdate(id, user, {
    returnDocument: 'after'
  });

  return userCompleted;
};

// * Update to worker type
// TODO: Downgrade to user type
export const updateToWorker = async (id, loggedID, data) => {
  if (id !== loggedID) throw createError(401, 'Unauthorized');

  if (data['email'] || data['password'])
    throw createError(401, 'Email and password cannot be updated here');

  if (!data.category || !data.expYears)
    throw createError(400, 'Worker must have category and expYears');

  const user = User.findById(id);

  if (user.type === 'worker') throw createError(400, 'User already a Worker');

  const worker = await User.findByIdAndUpdate(id, data, {
    returnDocument: 'after'
  });

  return worker;
};
