import mongoose from 'mongoose';
const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
try {
  await mongoose.connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
  );
  console.log('Successfully Connected to MDB');
} catch (error) {
  console.log('Error de conexión a MDB' + error);
}
