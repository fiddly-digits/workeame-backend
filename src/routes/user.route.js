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

const router = express.Router();

// * Register new User

router.post(
  '/register',
  [validateEmail, validatePassword],
  validationHandler,
  async (req, res) => {
    try {
      const createdUser = await register(req.body);
      if (!createdUser) throw createError(400, 'Error creating user');
      res
        .status(201)
        .json({ success: true, message: 'User created', data: createdUser }); // ! Remove data from response after testing
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

router.patch('/complete/:id', auth, async (req, res) => {
  try {
    const updatedUser = await completeProfile(req.params.id, req.body);
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

router.patch('/update/:id', auth, async (req, res) => {
  try {
    const updatedUser = await update(req.params.id, req.body);
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
// TODO: Downgrade to user type
router.patch('/worker/:id', auth, async (req, res) => {
  try {
    const UserUpdatedToWorker = await updateToWorker(req.params.id, req.body);
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
  '/mail/:id',
  auth,
  validateEmail,
  validationHandler,
  async (req, res) => {
    try {
      const updateMailUser = await updateMail(req.params.id, req.body);
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
  '/password/:id',
  auth,
  validateNewPassword,
  validationHandler,
  async (req, res) => {
    try {
      const updatePasswordUser = await updatePassword(req.params.id, req.body);
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedUser = await remove(req.params.id);
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
