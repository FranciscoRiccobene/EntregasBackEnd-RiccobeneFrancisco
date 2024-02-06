import winston from "winston";
import { customLevelOptions } from "../utils/loggerCustomLevelOptions.js";

const devLogger = winston.createLogger({
  levels: customLevelOptions.level,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export default devLogger;
