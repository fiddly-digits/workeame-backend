import express from 'express';
import cors from 'cors';

// * Import Routes
import routerUser from './routes/user.route.js';
import routerAuth from './routes/auth.route.js';

export const app = express();

// * Middleware cors and parse.json are required to use Express
app.use(cors());
app.use(express.json());

// * Routes
app.use('/api/v1/user', routerUser);
app.use('/api/v1/auth', routerAuth);

// * Testing Api
app.get('/api/v1', (req, res) => {
  res.json({ success: true, message: 'Working Api Ok' });
});
