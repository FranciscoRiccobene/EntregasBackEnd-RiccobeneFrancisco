import mongoose from "mongoose";
import config from "../config/dotenv.config.js";

const mongoConnect = async (req, res) => {
  try {
    await mongoose.connect(config.MONGO_DB, { dbName: "eccomerce" });
    req.logger.info("Connected to database");
  } catch (error) {
    req.logger.error(error);
  }
};

export default mongoConnect;
