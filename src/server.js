import express from 'express';
import cors from 'cors';

const { CORS_ORIGIN, PORT } = process.env;
const port = PORT || 8080;

// * Import Routes
import routerUser from './routes/user.route.js';
import routerAuth from './routes/auth.route.js';
import routerMicrosite from './routes/microsite.route.js';
import routerService from './routes/service.route.js';
import routerDiscount from './routes/discount.route.js';
import routerSchedule from './routes/schedule.route.js';
import routerReview from './routes/review.route.js';
import routerBooking from './routes/booking.route.js';

export const app = express();

// * Middleware cors and parse.json are required to use Express
app.use(
  cors({
    origin: CORS_ORIGIN || `http://localhost:${port}`
  })
);
app.use(express.json());

// * Routes
app.use('/api/v1/user', routerUser);
app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/ms', routerMicrosite);
app.use('/api/v1/service', routerService);
app.use('/api/v1/discount', routerDiscount);
app.use('/api/v1/schedule', routerSchedule);
app.use('/api/v1/review', routerReview);
app.use('/api/v1/booking', routerBooking);

// * Testing Api
app.get('/api/v1', (req, res) => {
  res.json({ success: true, message: 'Working Api Ok' });
});
