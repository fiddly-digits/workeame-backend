import createError from 'http-errors';
import { Discounts } from '../models/discounts.model.js';
import { Service } from '../models/service.model.js';

export const create = async (serviceID, provider, data) => {
  const service = await Service.findOne({ _id: serviceID, provider });
  if (!service) throw createError(404, 'Service not found');

  let discount = await Discounts.findOne({
    percentage: data.percentage,
    service
  });
  if (discount) throw createError(403, 'You already have this discount');

  data.service = serviceID;
  data.provider = provider;
  discount = await Discounts.create(data);
  discount.calculatePriceWithDiscount();
  return discount;
};

export const getAll = async (service) => {
  const discounts = await Discounts.find({ service });
  return discounts;
};

export const remove = async (discountID, provider) => {
  const service = await Service.findOne({
    provider,
    Discounts: discountID
  });
  if (!service) throw createError(404, 'Service not found');

  let discount = await Discounts.findOne({ _id: discountID });
  if (!discount) throw createError(404, 'Discount not found');

  discount = await Discounts.findOneAndDelete({ _id: discountID });
  return discount;
};
