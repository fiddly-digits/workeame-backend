import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'worker'],
    default: 'user',
    required: true
  },
  subscription: {
    type: String,
    enum: ['regular', 'premium'],
    default: 'regular',
    required: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
    required: true
  },
  address: {
    address_1: {
      type: String,
      maxlength: 20,
      required: true
    },
    address_2: {
      type: String,
      maxlength: 20
    }
  },
  phone: {
    type: String,
    match: /^\+(52|52)?\s?(\d{1,4}(\s|-)?\d{2,4}(\s|-)?\d{2,4}(\s|-)?\d{2,4})$/,
    unique: true
  },
  documentPhoto: {
    type: String
  },
  category: {
    type: String,
    enum: ['medicina', 'tatuajes', 'entretenimiento']
  },
  expYears: {
    type: Number
  }
});

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  delete obj.email;
  delete obj.password;
  return obj;
};

export const User = model('user', userSchema);
