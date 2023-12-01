import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;
const productsCollection = "Products";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  thumbnails: { type: [String] },
  isVisible: { type: Boolean, default: true },
});

productSchema.plugin(mongoosePaginate);

const Products = model(productsCollection, productSchema);

export default Products;
