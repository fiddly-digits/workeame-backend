import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  title: {
    type: String,
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
    description: { type: String, default: 'No description' }
  }
});

export const Appointment = model('Appointment', appointmentSchema);
