import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// ! validate how we are going to append to to the active hours array when appointment is created possibly a join between the two arrays.

const scheduleSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  weekday: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6]
  },
  availability: {
    type: Boolean,
    default: false
  },
  activeHours: {
    type: [Number],
    enum: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23
    ]
  },
  Worker: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }
});

scheduleSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('Worker');
    const { Worker } = this;
    Worker.Schedule.push(this._id);
    await Worker.save();
  }
});

export const Schedule = model('Schedule', scheduleSchema);

// type: function () {
//   this.activeHours.start.getHours() - this.activeHours.end.getHours();
//   return hours.typeof;
// }
