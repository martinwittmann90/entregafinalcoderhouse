import { Schema, model } from 'mongoose';

const TicketSchema = new Schema(
  {
    code: { type: String },
    purchase_datetime: { type: Date },
    amount: { type: Number },
    purchaser: { type: String },
    products: [{ product: { type: Object }, _id: false, quantity: { type: Number }, totalPrice: { type: Number } }],
  },
  { versionKey: false }
);

const TicketModel = model('tickets', TicketSchema);
export default TicketModel;
