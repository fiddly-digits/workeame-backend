import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.json());
app.use('/api/', authRoutes);

app.get('/', (req, res) => {
  res.json({ ok: true });
});

export default app;
