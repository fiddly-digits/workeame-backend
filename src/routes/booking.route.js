import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { create } from '../controllers/booking.controller.js';
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

export default router;
