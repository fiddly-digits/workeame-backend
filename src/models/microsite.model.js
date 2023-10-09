import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// ! Add a way to bookmark a microsite in next iteration

const micrositeSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  modifiedAt: {
    type: Date
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true
  }
});

micrositeSchema.post('findOneAndUpdate', async function (doc) {
  doc.modifiedAt = Date.now();
  await doc.save();
});

micrositeSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('owner');
    const { owner } = this;
    owner.isMicrositeCreated = true;
    await owner.save();
  }
});

export const Microsite = model('Microsite', micrositeSchema);
