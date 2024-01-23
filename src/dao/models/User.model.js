import mongoose from "mongoose";

const { Schema, model } = mongoose;
const usersCollection = "Users";
const cartsCollection = "Carts";

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  age: { type: Number },
  password: { type: String },
  cart: { type: Schema.Types.ObjectId, ref: cartsCollection },
  role: { type: String, default: "user" },
});

const User = model(usersCollection, userSchema);

export default User;
