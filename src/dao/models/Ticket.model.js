import mongoose from "mongoose";

const { Schema, model } = mongoose;
const TicketsCollection = "Tickets";

const ticketSchema = new Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const Ticket = mongoose.model(TicketsCollection, ticketSchema);

export default Ticket;
