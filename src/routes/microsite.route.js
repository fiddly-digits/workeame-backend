import express from 'express';
import createError from 'http-errors';
import {
  create,
  update,
  getMicrosite
} from '../controllers/microsite.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// * Create Microsite
router.post(
  '/create/',
  upload.array('carousel[]', 5),
  auth,
  async (req, res) => {
    try {
      const createdMicrosite = await create(
        req.verifiedID,
        req.body,
        req.files
      );
      if (!createdMicrosite) throw createError(400, 'Error creating microsite');
      res.status(201).json({
        success: true,
        message: 'Microsite created successfully',
        data: createdMicrosite
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

// * Get Microsite
router.get('/:micrositeURL', async (req, res) => {
  try {
    const microsite = await getMicrosite(req.params.micrositeURL);
    if (!microsite) throw createError(400, 'Error getting microsite');
    res.status(200).json({
      success: true,
      message: 'Microsite retrieved successfully',
      data: microsite
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Update Microsite
router.patch(
  '/update/',
  upload.array('newImages[]', 5),
  auth,
  async (req, res) => {
    try {
      console.log(req.files);
      const updatedMicrosite = await update(
        req.verifiedID,
        req.body,
        req.files
      );
      if (!updatedMicrosite) throw createError(400, 'Error updating microsite');
      res.status(200).json({
        success: true,
        message: 'Microsite updated successfully',
        data: updatedMicrosite
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

export default router;
