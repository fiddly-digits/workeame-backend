import createError from 'http-errors';
import { Service } from '../models/service.model.js';
import { User } from '../models/User.model.js';

export const create = async (data, provider) => {
  let user = await User.findById(provider);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a service');
  let service = await Service.findOne({ name: data.name });
  if (service) throw createError(403, 'Service already created');
  data['provider'] = provider;
  service = await Service.create(data);
  return service;
};
