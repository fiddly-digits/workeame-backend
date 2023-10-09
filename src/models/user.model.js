import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;

// ! Add Rating to worker and user in next iteration

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
  isVerified: {
    type: Boolean,
    default: false
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
  isMicrositeCreated: {
    type: Boolean,
    default: false
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
    locality: {
      type: String,
      maxlength: 20
    },
    municipality: {
      type: String,
      maxlength: 20
    },
    state: {
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
  CURP: {
    type: String,
    sparse: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Medicina', 'Tatuajes', 'Entretenimiento']
  },
  expertise: {
    type: String,
    enum: ['0-1', '1-2', '2-3', '3-4', '4-5', '5 o mas']
  },
  Services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Services'
    }
  ],
  Schedule: {
    type: [Schema.Types.ObjectId],
    ref: 'Schedule',
    validate: [limitValidation(7), 'Schedule cannot have more than 7 days']
  },
  Reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reviews'
    }
  ]
});

function limitValidation(limit) {
  return function (val) {
    return val.length <= limit;
  };
}

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

userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this._update.password, salt);
    this._update.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
    throw new Error('Error hashing password');
  }
});

// * Child Reference

// userSchema.post('findOneAndDelete', async function (user) {
//   if (user.Reviews.length) {
//     const res = await Review.deleteMany({ _id: { $in: user.Reviews } });
//     console.log(res);
//   }
//   if (user.Services.length)
//     await Service.deleteMany({ _id: { $in: user.Services } });
//   if (user.Schedule.length)
//     await Schedule.deleteMany({ _id: { $in: user.Schedule } });
// });

// * Parent Reference

userSchema.post('findOneAndDelete', async function (id) {
  await model('Microsite').deleteMany({ owner: id });
  await model('Reviews').deleteMany({ worker: id });
  await model('Services').deleteMany({ provider: id });
  await model('Schedule').deleteMany({ worker: id });
  await model('Booking').deleteMany({ customer: id });
  await model('Booking').deleteMany({ provider: id });
  await model('Discounts').deleteMany({ provider: id });
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

// TODO: Method to remove password and email from response, activate in production
// userSchema.methods.toJSON = function () {
//   let obj = this.toObject();
//   delete obj.__v;
//   delete obj.password;
//   delete obj.email;
//   return obj;
// };

export const User = model('Users', userSchema);
