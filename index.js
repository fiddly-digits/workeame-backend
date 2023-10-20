import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './src/server.js';

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, PORT } = process.env;
const dbURL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
const port = PORT || 8080;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
      console.log(`Server listening on URI http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error}`);
  });
