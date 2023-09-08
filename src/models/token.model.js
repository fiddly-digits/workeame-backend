import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  uID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

export const Token = model('Token', tokenSchema, 'Token');
