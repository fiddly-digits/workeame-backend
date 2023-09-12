import createError from 'http-errors';
import { Service } from '../models/service.model.js';
import { User } from '../models/User.model.js';

export const create = async (data, provider, creator) => {
  if (provider !== creator)
    throw createError(403, 'User must be owner of the service');
  let user = await User.findById(provider);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a service');
  let service = await Service.findOne({ name: data.name, provider });
  if (service) throw createError(403, 'Service already created');
  data['provider'] = provider;
  service = await Service.create(data);
  return service;
};

export const get = async (provider) => {
  let user = await User.findById(provider);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a service');
  let services = await Service.find({ provider });
  if (!services) throw createError(404, 'Services not found');
  return services;
};

export const update = async (data, provider, creator) => {
  let service = await Service.findOne({ _id: serviceID });
  if (!service) throw createError(404, 'Service not found');
  console.log(data);

  //   if (data.discount.percentage < 5 || data.discount.percentage > 50)
  //     throw createError(400, 'Discount must be between 5 and 50');

  data.discount.description = !data.discount.description
    ? service.discount.description
    : data.discount.description;
  data.discount.percentage = !data.discount.percentage
    ? service.discount.percentage
    : data.discount.percentage;

  service = await Service.findOneAndUpdate({ _id: serviceID }, data, {
    returnDocument: 'after'
  });
  return service;
};
