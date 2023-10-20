import createError from 'http-errors';
import { Service } from '../models/service.model.js';
import { User } from '../models/user.model.js';

export const create = async (provider, data) => {
  let user = await User.findById(provider);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to give a service');
  let service = await Service.findOne({ name: data.name, provider });
  if (service) throw createError(403, 'Service already created');
  data['provider'] = provider;
  service = await Service.create(data);
  return service;
};

export const get = async (provider) => {
  let services = await Service.find({ provider });
  if (!services) throw createError(404, 'Services not found');
  return services;
};

export const update = async (provider, serviceID, data) => {
  let service = await Service.findOne({ _id: serviceID, provider });
  if (!service) throw createError(404, 'Service not found');
  service = await Service.findOneAndUpdate({ _id: serviceID }, data, {
    returnDocument: 'after'
  });
  return service;
};

export const remove = async (provider, serviceID) => {
  let service = await Service.findOne({ _id: serviceID, provider });
  if (!service) throw createError(404, 'Service not found');
  service = await Service.findOneAndDelete({ _id: serviceID });
  return service;
};
