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
  finalPrice: { type: Number },
  provider: { type: Schema.Types.ObjectId, ref: 'Users' }
});

discountsSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('service');
    const { service } = this;
    service.Discounts.push(this._id);
    await service.save();
  }
});

discountsSchema.post('findOneAndDelete', async function (doc, next) {
  await doc.populate('service');
  const { service } = doc;
  service.Discounts.pull(doc._id);
  await service.save();
  next();
});

discountsSchema.methods.calculatePriceWithDiscount = async function () {
  this.populate('service');
  const { service } = this;
  const initialPrice = service.price;
  this.finalPrice = initialPrice - initialPrice * (this.percentage / 100);
  await this.save();
};

discountsSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.provider;
  return obj;
};

export const Discounts = model('Discounts', discountsSchema);
