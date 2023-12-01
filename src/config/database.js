import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://franriccobene463352:T9L7sXqW09RRUcC2@codercluster.h9gmu7u.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "eccomerce" }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Connected to database");
});

export { mongoose, db };
