import mongoose from "mongoose";
import config from "../config/dotenv.config.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(config.MONGO_DB, { dbName: "eccomerce" });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

export default mongoConnect;
