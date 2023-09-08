import express from 'express';
import { refreshToken } from '../middlewares/auth.middleware.js';

import { login } from '../controllers/user.controller.js';
import { generateToken } from '../utils/auth.utils.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { token, expiresIn } = await login(req.body, res);

    return res.status(200).json({ success: true, token, expiresIn });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

router.get('/refresh', refreshToken, async (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid);
    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'error de server' });
  }
});

export default router;
