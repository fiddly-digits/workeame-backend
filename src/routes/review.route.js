import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import {
  create,
  update,
  remove,
  getScore
} from '../controllers/review.controller.js';
const router = express.Router();

router.post('/create/:id', auth, async (req, res) => {
  try {
    const review = await create(req.verifiedID, req.params.id, req.body);
    if (!review) throw createError(400, 'Error creating review');
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.patch('/update/:id', auth, async (req, res) => {
  try {
    const review = await update(req.verifiedID, req.params.id, req.body);
    if (!review) throw createError(400, 'Error updating review');
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const review = await remove(req.verifiedID, req.params.id);
    if (!review) throw createError(400, 'Error removing review');
    res.status(200).json({
      success: true,
      message: 'Review removed successfully',
      data: review
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.get('/score/:id', async (req, res) => {
  try {
    const score = await getScore(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Score retrieved successfully',
      data: score
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
