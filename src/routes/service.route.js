import express from 'express';
import createError from 'http-errors';
import { auth } from '../middlewares/auth.middleware.js';
import {
  create,
  get,
  update,
  remove
} from '../controllers/service.controller.js';

const router = express.Router();

// * Create Service
router.post('/create/', auth, async (req, res) => {
  try {
    const createdService = await create(req.verifiedID, req.body);
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

// * Get Services from one provider
router.get('/:id', async (req, res) => {
  try {
    const services = await get(req.params.id);
    if (!services) throw createError(400, 'Error getting services');
    res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: services
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Update Service needs param with service id
router.patch('/update/:id', auth, async (req, res) => {
  try {
    const updatedService = await update(
      req.verifiedID,
      req.params.id,
      req.body
    );
    if (!updatedService) throw createError(400, 'Error updating service');
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deletedService = await remove(req.verifiedID, req.params.id);
    if (!deletedService) throw createError(400, 'Error deleting service');
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: deletedService
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
