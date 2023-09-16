import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  modifiedAt: {
    type: Date
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    minLength: [20, 'length must be at least 20 characters'],
    maxLength: 300,
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

reviewSchema.post('findOneAndUpdate', async function (doc) {
  doc.modifiedAt = Date.now();
  await doc.save();
});

reviewSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('worker');
    const { worker } = this;
    worker.Reviews.push(this._id);
    await worker.save();
  }
});

reviewSchema.post('findOneAndDelete', async function (doc, next) {
  await doc.populate('worker');
  const { worker } = doc;
  worker.Reviews.pull(doc._id);
  await worker.save();
  next();
});

export const Review = model('Reviews', reviewSchema);
