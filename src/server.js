import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();

// * Middleware Cors, Json, CookieParser
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// * Routes

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Welcome to the API' });
});

export default app;
