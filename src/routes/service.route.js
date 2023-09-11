import express from 'express';
import createError from 'http-errors';
import { auth } from '../middlewares/auth.middleware.js';
import { create } from '../controllers/service.controller.js';

const router = express.Router();

// * Create Service
router.post('/create/:id', auth, async (req, res) => {
  try {
    const createdService = await create(req.body, req.verifiedID);
    if (!createdService) throw createError(400, 'Error creating service');
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: createdService
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
