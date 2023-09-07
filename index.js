import 'dotenv/config';
import './src/database/connect.js';
import app from './src/server.js';
import cookieParser from 'cookie-parser';

const { PORT } = process.env;
const port = PORT || 8080;

app.listen(port, () => console.log('WORKING ON: http://localhost:8080'));
