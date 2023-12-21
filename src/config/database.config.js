import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGO_DB, { dbName: "eccomerce" });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Connected to database");
});

export { mongoose, db };
