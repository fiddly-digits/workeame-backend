import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
    select: false,
    index: { unique: true }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  lastName: {
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
    street: {
      type: String,
      maxlength: 20
    },
    city: {
      type: String,
      maxlength: 20
    },
    country: {
      type: String,
      maxlength: 20
    },
    postCode: {
      type: String,
      minlength: 5,
      maxlength: 5
    }
  },
  phone: {
    // ! Sparse is for unique fields that can be null
    type: String,
    match: /^\+(52|52)?\s?(\d{1,4}(\s|-)?\d{2,4}(\s|-)?\d{2,4}(\s|-)?\d{2,4})$/,
    sparse: true,
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

// ! Pre middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
    throw new Error('Error hashing password');
  }
});

// ! Method to compare password
userSchema.methods.comparePassword = async function (clientPassword) {
  return await bcrypt.compare(clientPassword, this.password);
};

// userSchema.post('save', async function (next) {
//   try {
//     this.photo = `https://api.dicebear.com/7.x/identicon/svg?seed=${
//       Math.floor(Math.random() * 90000) + 10000
//     }`;
//   } catch (error) {
//     next(error);
//     throw new Error('Error generating photo');
//   }
// });

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  delete obj.email;
  delete obj.password;
  return obj;
};

export const User = model('Users', userSchema, 'Users');
