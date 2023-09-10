import createError from 'http-errors';
import { Microsite } from '../models/microsite.model.js';
import { User } from '../models/User.model.js';

export const create = async (data, owner) => {
  let user = await User.findById(owner);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a microsite');
  let microsite = await Microsite.findOne({ owner });
  if (microsite) throw createError(403, 'Microsite already created');
  data['owner'] = owner;
  microsite = await Microsite.create(data);
  return microsite;
};

export const getMicrosite = async (owner) => {
  const microsite = await Microsite.findOne({ owner });
  if (!microsite) throw createError(404, 'Microsite not found');
  return microsite;
};

export const update = async (data, owner) => {
  let microsite = await Microsite.findOne({ owner });
  if (!microsite) throw createError(404, 'Microsite not found');

  if (data.about.length < 20 || data.about.length > 300)
    throw createError(400, 'About must be between 20 and 300 characters');

  data.carousel.image_1 = !data.carousel.image_1
    ? microsite.carousel.image_1
    : data.carousel.image_1;
  data.carousel.image_2 = !data.carousel.image_2
    ? microsite.carousel.image_2
    : data.carousel.image_2;
  data.carousel.image_3 = !data.carousel.image_3
    ? microsite.carousel.image_3
    : data.carousel.image_3;
  data.carousel.image_4 = !data.carousel.image_4
    ? microsite.carousel.image_4
    : data.carousel.image_4;

  microsite = await Microsite.findOneAndUpdate({ owner }, data, {
    returnDocument: 'after'
  });

  return microsite;
};
