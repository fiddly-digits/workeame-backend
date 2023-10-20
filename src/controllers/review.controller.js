import createError from 'http-errors';
import { Review } from '../models/review.model.js';
import { User } from '../models/user.model.js';
import { Service } from '../models/service.model.js';

// ! User and worker can review each other in Next iteration

export const create = async (reviewer, worker, data) => {
  if (reviewer === worker) throw createError(401, 'You cannot review yourself');
  const workerExists = await User.exists({ _id: worker }); // ! change all user existence validations to this
  if (!workerExists) throw createError(404, 'Worker not found');
  const WorkerHasServices = await Service.exists({ provider: worker });
  if (!WorkerHasServices)
    throw createError(403, 'Worker has no services related');

  const reviewExists = await Review.exists({ reviewer, worker });
  if (reviewExists) throw createError(403, 'Review already exists');

  data.reviewer = reviewer;
  data.worker = worker;
  const review = await Review.create(data);
  return review;
};

export const update = async (reviewer, worker, data) => {
  const workerExists = await User.exists({ _id: worker });
  if (!workerExists) throw createError(404, 'Worker not found');

  const reviewExists = await Review.exists({ reviewer, worker });
  if (!reviewExists) throw createError(403, 'Review Does not exists');

  const review = await Review.findOneAndUpdate({ reviewer, worker }, data, {
    returnDocument: 'after'
  });
  return review;
};

export const remove = async (reviewer, worker) => {
  const review = await Review.findOneAndDelete({ reviewer, worker });
  return review;
};

export const getScore = async (worker) => {
  const reviews = await Review.find({ worker });
  if (!reviews.length) throw createError(404, 'Worker has no reviews');
  const score = reviews.reduce((acc, review) => acc + review.rating, 0);
  return { worker, score: score / reviews.length };
};

export const getReviews = async (worker) => {
  const reviews = await Review.find({ worker });
  if (!reviews.length) throw createError(404, 'Worker has no reviews');
  return reviews;
};
