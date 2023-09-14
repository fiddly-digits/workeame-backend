import createError from 'http-errors';
import { Schedule } from '../models/schedule.model.js';
import { User } from '../models/user.model.js';

export const create = async (worker, data) => {
  console.log(worker);
  const user = await User.findById(worker);
  if (!user) throw createError(404, 'User not found');
  if (user.type !== 'worker')
    throw createError(403, 'User must be worker to have a schedule');

  data.date = new Date(data.date);
  data['weekday'] = data.date.getDay();

  let schedule = await Schedule.findOne({
    Worker: worker,
    weekday: data.weekday
  });
  if (schedule) throw createError(403, 'Schedule already created');

  data['Worker'] = worker;

  schedule = await Schedule.create(data);
  return schedule;
};

// TODO: update schedule
