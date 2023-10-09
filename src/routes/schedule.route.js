import express from 'express';
import createError from 'http-errors';
import { auth } from '../middlewares/auth.middleware.js';
import { create, update, get } from '../controllers/schedule.controller.js';

const router = express.Router();

// * Create Schedule
router.post('/create/', auth, async (req, res) => {
  try {
    const userSchedule = await create(req.verifiedID, req.body);
    if (!userSchedule) throw createError(400, 'Error creating schedule');
    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: userSchedule
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.patch('/update/:id', auth, async (req, res) => {
  try {
    console.log(req.body);
    const userSchedule = await update(req.verifiedID, req.params.id, req.body);
    if (!userSchedule) throw createError(400, 'Error updating schedule');
    res.status(201).json({
      success: true,
      message: 'Schedule updated successfully',
      data: userSchedule
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userSchedule = await get(req.params.id);
    if (!userSchedule) throw createError(400, 'Error getting schedule');
    res.status(201).json({
      success: true,
      message: 'Schedule retrieved successfully',
      data: userSchedule
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
