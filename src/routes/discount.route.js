import express from 'express';
import createError from 'http-errors';
import { auth } from '../middlewares/auth.middleware.js';
import { create, remove, getAll } from '../controllers/discount.controller.js';

const router = express.Router();

// * Create Discount
router.post('/create/:id', auth, async (req, res) => {
  try {
    const createdDiscount = await create(
      req.params.id,
      req.verifiedID,
      req.body
    );
    if (!createdDiscount) throw createError(400, 'Error creating discount');
    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      data: createdDiscount
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Get All Discounts from Service

router.get('/all/:id', async (req, res) => {
  try {
    const discounts = await getAll(req.params.id);
    if (!discounts) throw createError(404, 'Discounts not found');
    res.status(200).json({
      success: true,
      message: 'Discounts retrieved successfully',
      data: discounts
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Delete Discount
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deletedDiscount = await remove(req.params.id, req.verifiedID);
    if (!deletedDiscount) throw createError(400, 'Error deleting discount');
    res.status(200).json({
      success: true,
      message: 'Discount deleted successfully',
      data: deletedDiscount
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
