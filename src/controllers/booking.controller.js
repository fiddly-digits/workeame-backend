import { Booking } from '../models/booking.model.js';
import { Service } from '../models/service.model.js';
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
    provider: service.provider,
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

export const updateDate = async (serviceID, customer, data) => {
  if (Object.keys(data).every((key) => key !== 'start'))
    throw createError(401, 'Unauthorized');

  const service = await Service.findOne({ _id: serviceID });
  if (!service) throw createError(404, 'Service not found');

  data.start = new Date(data.start);
  if (data.end) {
    data.end = new Date(data.end);
  } else {
    const startDate = new Date(data.start);
    data.end = new Date(startDate.setHours(startDate.getHours() + 1));
  }
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
    provider: service.provider,
    start: data.start
  });
  if (booking) throw createError(403, 'Time slot is already booked');

  const modifiedBooking = await Booking.findOneAndUpdate(
    { service: serviceID, customer },
    { start: data.start, end: data.end },
    { returnDocument: 'after' }
  );
  return modifiedBooking;
};

export const updateStatus = async (bookingID, id, data) => {
  const isCustomer = await Booking.exists({ _id: bookingID, customer: id });
  const isProvider = await Booking.exists({ _id: bookingID, provider: id });
  if (!isCustomer && !isProvider) throw createError(401, 'Unauthorized');

  let booking = await Booking.findById({ _id: bookingID });

  if (
    booking.workerStatus === 'cancelled' ||
    booking.clientStatus === 'cancelled'
  )
    throw createError(403, 'You cannot update a cancelled booking');

  if (
    booking.workerStatus === 'completed' ||
    booking.clientStatus === 'completed'
  )
    throw createError(403, 'You cannot update a completed booking');
  // ! Validate date errors
  if (data.status === 'cancelled' && booking.start < new Date())
    throw createError(
      403,
      'You cannot cancel a booking that has already started'
    );

  if (data.status === 'completed' && booking.end > new Date())
    throw createError(
      403,
      'You cannot complete a booking that has not yet ended'
    );

  if (isCustomer) {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingID, customer: id },
      { clientStatus: data.status },
      { returnDocument: 'after' }
    );
    return booking;
  } else {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingID, provider: id },
      { workerStatus: data.status },
      { returnDocument: 'after' }
    );
    return booking;
  }
};

export const getBookings = async (id, { type }) => {
  if (!type) throw createError(400, 'Missing type');
  if (type !== 'provider' && type !== 'customer')
    throw createError(401, 'Unauthorized');
  if (type === 'provider') {
    const isProvider = await Booking.exists({ provider: id });
    if (!isProvider) throw createError(404, 'Bookings not found');
    const bookings = await Booking.find({ provider: id });
    return bookings;
  } else if (type === 'customer') {
    const isCustomer = await Booking.exists({ customer: id });
    if (!isCustomer) throw createError(404, 'Bookings not found');
    const bookings = await Booking.find({ customer: id });
    return bookings;
  }
};
