import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import {
  create,
  updateDate,
  updateStatus,
  getBookings,
  paymentUpdated
} from '../controllers/booking.controller.js';
import createError from 'http-errors';

const router = express.Router();

// * Create Booking
router.post('/create/:id', auth, async (req, res) => {
  try {
    const createdBooking = await create(
      req.params.id,
      req.verifiedID,
      req.body
    );
    if (!createdBooking) throw createError(400, 'Error creating booking');
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: createdBooking
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Update Date in Booking
router.patch('/reschedule/:id', auth, async (req, res) => {
  try {
    const updatedBooking = await updateDate(
      req.params.id,
      req.verifiedID,
      req.body
    );
    if (!updatedBooking) throw createError(400, 'Error updating booking');
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Update Booking Worker Status

router.patch('/statusUpdate/:id', auth, async (req, res) => {
  try {
    const updatedBooking = await updateStatus(
      req.params.id,
      req.verifiedID,
      req.body
    );
    if (!updatedBooking) throw createError(400, 'Error updating booking');
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Get all bookings from user with query param "client" or "provider" to filter
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await getBookings(req.verifiedID, req.query);
    if (!bookings) throw createError(404, 'Bookings not found');
    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.patch('/paymentUpdate/:id', auth, async (req, res) => {
  try {
    const booking = await paymentUpdated(
      req.params.id,
      req.verifiedID,
      req.body
    );
    if (!booking) throw createError(400, 'Error updating booking');
    res.status(200).json({
      success: true,
      message: 'Booking payment updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
