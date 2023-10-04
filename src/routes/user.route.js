import express from 'express';
import createError from 'http-errors';

import {
  register,
  getAllWorkers,
  getOne,
  update,
  remove,
  updateToWorker,
  completeProfile,
  updateMail,
  updatePassword
} from '../controllers/user.controller.js';
import {
  validateEmail,
  validatePassword,
  validateNewPassword,
  validationHandler
} from '../middlewares/verification.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// * Register new User

router.post(
  '/register',
  upload.single('photo'),
  [validateEmail, validatePassword],
  validationHandler,
  async (req, res) => {
    try {
      const createdUser = await register(req.body, req.file);
      if (!createdUser) throw createError(400, 'Error creating user');
      res
        .status(201)
        .json({ success: true, message: 'User created', data: createdUser }); // TODO: Remove data from response after testing
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

//*get all WORKER users

router.get('/all', async (req, res) => {
  try {
    const users = await getAllWorkers();
    if (!users) throw createError(400, 'Error getting users');
    res.status(200).json({ success: true, data: users });
  } catch (error) {}
});

//* get one user by id

router.get('/:id', async (req, res) => {
  try {
    const user = await getOne(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

//* complete profile data

router.patch('/complete/', auth, async (req, res) => {
  try {
    const updatedUser = await completeProfile(req.verifiedID, req.body);
    if (!updatedUser) throw createError(400, 'Error updating user');
    res.status(200).json({
      success: true,
      message: 'User Completed profile successfully',
      data: updatedUser
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Plain Update could be better

router.patch('/update/', upload.single('photo'), auth, async (req, res) => {
  try {
    const updatedUser = await update(req.verifiedID, req.body, req.file);
    if (!updatedUser) throw createError(400, 'Error updating user');
    res.status(200).json({
      success: true,
      message: 'User Updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// * Update to worker type
router.patch('/workerUpdate/', auth, async (req, res) => {
  try {
    const UserUpdatedToWorker = await updateToWorker(req.verifiedID, req.body);
    if (!UserUpdatedToWorker) throw createError(400, 'Error updating user');
    res.status(200).json({
      success: true,
      message: 'User Updated to worker successfully',
      data: UserUpdatedToWorker
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.patch(
  '/mailChange/',
  auth,
  validateEmail,
  validationHandler,
  async (req, res) => {
    try {
      const updateMailUser = await updateMail(req.verifiedID, req.body);
      if (!updateMailUser) throw createError(400, 'Error updating user');
      res.status(200).json({
        success: true,
        message: 'User Updated his mail successfully',
        data: updateMailUser
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

router.patch(
  '/passwordChange/',
  auth,
  validateNewPassword,
  validationHandler,
  async (req, res) => {
    try {
      const updatePasswordUser = await updatePassword(req.verifiedID, req.body);
      if (!updatePasswordUser) throw createError(400, 'Error updating user');
      res.status(200).json({
        success: true,
        message: 'User Updated his password successfully',
        data: updatePasswordUser
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
);

router.delete('/delete/', auth, async (req, res) => {
  try {
    const deletedUser = await remove(req.verifiedID);
    if (!deletedUser) throw createError(400, 'Error deleting user');
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

export default router;
