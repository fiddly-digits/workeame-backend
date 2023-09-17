import { Booking } from '../models/booking.model.js';
import { Service } from '../models/service.model.js';
import { User } from '../models/user.model.js';
import { Schedule } from '../models/schedule.model.js';
import createError from 'http-errors';

export const create = async (serviceID, customer, data) => {
  console.log('Service ID: ', serviceID);
  console.log('Customer: ', customer);
  console.log('Data: ', data);

  const service = await Service.findOne({ _id: serviceID });
  if (!service) throw createError(404, 'Service not found');
  if (customer === service.provider)
    throw createError(403, 'You cannot book your own service');
  data.start = new Date(data.start);
  if (data.end) data.end = new Date(data.end);
  const schedule = await Schedule.findOne({
    Worker: service.provider,
    weekday: data.start.getDay()
  });
  if (!schedule) throw createError(404, 'Schedule not found');
  if (schedule.availability === false)
    throw createError(403, 'Worker is not available in this day');
  if (!schedule.activeHours.includes(data.start.getHours()))
    throw createError(403, 'Worker is not available at this hour');
  const booking = await Booking.exists({
    service: serviceID,
    start: data.start
  });
  if (booking) throw createError(403, 'Time slot is already booked');
  data['service'] = serviceID;
  data['customer'] = customer;
  data['provider'] = service.provider;
  data['name'] = service.name;
  const createdBooking = await Booking.create(data);
  return createdBooking;
};
