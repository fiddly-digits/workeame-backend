import 'dotenv/config';
import './src/database/connect.js';
import express from 'express';
const app = express();
const { PORT } = process.env;
const port = PORT || 8080;

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => console.log('WORKING ON: http://localhost:8080'));
