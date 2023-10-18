import createError from 'http-errors';
import { Microsite } from '../models/microsite.model.js';
import { User } from '../models/user.model.js';
import crypto from 'crypto';

export const create = async (owner, data, files) => {
  let user = await User.findById(owner);
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a microsite');
  let microsite = await Microsite.findOne({ owner });
  if (microsite) throw createError(403, 'Microsite already created');
  data['owner'] = owner;
  data['carousel'] = {};
  files.forEach((file, index) => {
    data['carousel'][`image_${index + 1}`] = file.location;
  });
  data.micrositeId = `${user.name.toLowerCase()}-${user.category
    .toLowerCase()
    .replace(/^\s+|\s+$/gm, '')}-${crypto.randomBytes(5).toString('hex')}`;
  microsite = await Microsite.create(data);
  return microsite;
};

export const getMicrosite = async (micrositeURL) => {
  const microsite = await Microsite.findOne({ micrositeURL })
    .populate({
      path: 'owner',
      populate: { path: 'Services' }
    })
    .populate({
      path: 'owner',
      populate: { path: 'Schedule' }
    });
  if (!microsite) throw createError(404, 'Microsite not found');
  return microsite;
};

export const update = async (owner, data, files) => {
  let microsite = await Microsite.findOne({ owner });
  if (!microsite) throw createError(404, 'Microsite not found');

  if (data.about) {
    if (data.about.length < 20 || data.about.length > 300)
      throw createError(400, 'About must be between 20 and 300 characters');
  }

  let carouselIndex = 0;
  if (data.carousel) {
    carouselIndex = Object.keys(data.carousel).length;
  }

  if (files.length > 0) {
    files.forEach((file) => {
      data.carousel[`image_${carouselIndex + 1}`] = file.location;
    });
  }

  // data.carousel.image_1 = !data.carousel.image_1
  //   ? microsite.carousel.image_1
  //   : data.carousel.image_1;
  // data.carousel.image_2 = !data.carousel.image_2
  //   ? microsite.carousel.image_2
  //   : data.carousel.image_2;
  // data.carousel.image_3 = !data.carousel.image_3
  //   ? microsite.carousel.image_3
  //   : data.carousel.image_3;
  // data.carousel.image_4 = !data.carousel.image_4
  //   ? microsite.carousel.image_4
  //   : data.carousel.image_4;

  microsite = await Microsite.findOneAndUpdate({ owner }, data, {
    returnDocument: 'after'
  });

  return microsite;
};
