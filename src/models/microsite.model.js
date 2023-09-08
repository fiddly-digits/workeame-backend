import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// ! Add weblinks and shorter links for social media
// ! Add a way to bookmark a microsite

const micrositeSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  theme: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    default: 1
  },
  carousel: {
    image_1: {
      type: String
    },
    image_2: {
      type: String
    },
    image_3: {
      type: String
    },
    image_4: {
      type: String
    },
    image_5: {
      type: String
    }
  },
  about: {
    type: String,
    minLength: 20,
    maxLenght: 300,
    required: true
  },
  Owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
});

export const Microsite = model('Microsite', micrositeSchema, 'Microsite');
