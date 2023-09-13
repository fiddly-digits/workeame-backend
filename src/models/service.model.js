import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  Discounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Discounts'
    }
  ],
  isPaymentPerHour: { type: Boolean },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

serviceSchema.post('findOneAndDelete', async function (doc, next) {
  await doc.populate('provider');
  const { provider } = doc;
  provider.Services.pull(doc._id);
  await provider.save();
  next();
});

serviceSchema.pre('save', async function (next) {
  if (this.isNew) {
    await this.populate('provider');
    const { provider } = this;
    provider.Services.push(this._id);
    await provider.save();
  }
});

export const Service = model('Services', serviceSchema);
