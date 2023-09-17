import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
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
      }
    ],
    default: function () {
      const date = new Date(this.start);
      return date.setDate(date.getDate() + 1);
    },
    comments: { type: String, default: 'No additional comment provided' },
    provider: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});

export const Booking = model('Appointment', appointmentSchema);
