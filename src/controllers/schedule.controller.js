import createError from 'http-errors';
import { Schedule } from '../models/schedule.model.js';
import { User } from '../models/user.model.js';

export const create = async (worker, data) => {
  if (!data.date) throw createError(400, 'Date is required');
  const user = await User.findById(worker);
  if (!user) throw createError(404, 'Worker not found');
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a schedule');

  data.date = new Date(data.date);

  if (data.availability === false && data.activeHours.length !== 0)
    data.activeHours = [];

  let schedule = await Schedule.findOne({
    Worker: worker,
    weekday: data.weekday
  });
  if (schedule) throw createError(403, 'Schedule already created');

  data['Worker'] = worker;

  schedule = await Schedule.create(data);
  return schedule;
};

export const update = async (worker, scheduleID, data) => {
  if (!data.date) throw createError(400, 'Date is required');
  const user = await User.findById(worker);
  if (!user) throw createError(404, 'User not found');
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a schedule');

  data.date = new Date(data.date);
  data['weekday'] = data.date.getDay();
  data['Worker'] = worker;
  if (data.availability === false && data.activeHours.length !== 0)
    data.activeHours = [];

  const schedule = await Schedule.findOneAndUpdate({ _id: scheduleID }, data, {
    returnDocument: 'after'
  });
  if (!schedule) throw createError(404, 'Schedule not found');
  return schedule;
};

export const get = async (worker) => {
  const user = await User.findById(worker);
  if (!user) throw createError(404, 'User not found');
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a schedule');

  const schedule = await Schedule.find({ Worker: worker });
  if (!schedule) throw createError(404, 'Schedule not found');
  return schedule;
};
