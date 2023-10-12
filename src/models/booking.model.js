import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Services',
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  timeslot: {
    type: [Number],
    enum: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23
    ]
  },
  start: {
    type: Date,
    required: true,
    min: new Date()
  },
  end: {
    type: Date,
    min: [
      function () {
        const date = new Date(this.start);
        const validDate = new Date(date.setHours(date.getHours() + 1));
        return validDate;
      },
      "End date can't be before start date"
    ],
    default: function () {
      const date = new Date(this.start);
      return date.setHours(date.getHours() + 1);
    }
  },
  comments: { type: String, default: 'No additional comment provided' },
  provider: { type: Schema.Types.ObjectId, ref: 'User' },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  workerStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  clientStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  isFlagged: { type: Boolean, default: false }
});

bookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('service');
    const { service } = this;
    service.Bookings.push(this._id);
    await service.save();
  }
});

export const Booking = model('Booking', bookingSchema);
