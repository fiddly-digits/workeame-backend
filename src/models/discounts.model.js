import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const discountsSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Services'
  },
  description: { type: String, required: true },
  percentage: {
    type: Number,
    enum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    required: true
  },
  finalPrice: { type: Number }
});

discountsSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('service');
    const { service } = this;
    service.Discounts.push(this._id);
    await service.save();
  }
});

discountsSchema.methods.calculateDiscount = function (initialPrice) {
  this.finalPrice = initialPrice - initialPrice * (this.percentage / 100);
  return this.finalPrice;
};

export const Discounts = model('Discounts', discountsSchema);
