import winston from "winston";
import { customLevelOptions } from "../utils/loggerCustomLevelOptions.js";
import fs from "fs";

const logsDirectory = "logs";

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const prodLogger = winston.createLogger({
  levels: customLevelOptions.level,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: `${logsDirectory}/errors.log`,
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export default prodLogger;
