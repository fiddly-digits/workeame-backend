import express from 'express';
import { register, remove } from '../controllers/user.controller.js';
import { userDataValidator } from '../middlewares/user.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';
import createError from 'http-errors';
const router = express.Router();

// * Register new User
// TODO: mail confirmation
router.post('/register', userDataValidator, async (req, res) => {
  try {
    const createdUser = await register(req.body);

    // ! Mail confirmation

    return res.status(201).json({ success: true, user: createdUser });
  } catch (error) {
    console.log('Error status and message: ', error.status, error.message);
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.uid !== req.params.id) throw createError(403, 'Unauthorized');
    const deletedUser = remove(req.uid);
    if (!deletedUser) throw createError(404, 'User not found');
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.log('Error status and message: ', error.status, error.message);
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.get('/logout', async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export default router;
