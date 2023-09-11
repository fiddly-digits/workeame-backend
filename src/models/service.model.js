import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  initialPrice: { type: Number, required: true },
  discount: {
    description: { type: String },
    percentage: { type: Number, enum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] }
  },
  finalPrice: { type: Number },
  isPaymentPerHour: { type: Boolean }
});

serviceSchema.post('save', async function (doc, next) {
  if (!doc.discount.percentage) {
    doc.finalPrice = doc.initialPrice;
  } else {
    doc.finalPrice =
      doc.initialPrice - doc.initialPrice * (doc.discount.percentage / 100);
  }
  console.log(doc);
  await Service.findOneAndUpdate({ _id: doc._id }, doc);
  next();
});

export const Service = model('Service', serviceSchema, 'Service');

//   discounts: {
//     type: new Schema({
//       detail: { type: String, required: true },
//       discount: {
//         type: Number,
//         enum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
//         required: true
//       }
//     }),
//     required: false
//   },
