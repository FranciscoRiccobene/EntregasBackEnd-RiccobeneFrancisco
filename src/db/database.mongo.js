import mongoose from "mongoose";
import config from "../config/dotenv.config.js";
import { logger } from "../logger/factory.js";

const mongoConnect = async (req, res) => {
  try {
    await mongoose.connect(config.MONGO_DB, { dbName: "eccomerce" });
    logger.info("Connected to database");
  } catch (error) {
    logger.error(error);
  }
};

export default mongoConnect;
