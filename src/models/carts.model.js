import mongoose from "mongoose";

const { Schema, model } = mongoose;
const cartsCollection = "Carts";

const productSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Products", required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema({
  products: [productSchema],
});

const Carts = model(cartsCollection, cartSchema);

export default Carts;
