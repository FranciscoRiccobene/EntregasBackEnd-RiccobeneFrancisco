import { appConfig } from "../config/app.config.js";
import devLogger from "./dev.logger.js";
import prodLogger from "./prod.logger.js";

let logger;

if (appConfig.environment === "development") {
  logger = devLogger;
  logger.info("development");
} else {
  logger = prodLogger;
  logger.info("production");
}

export { logger };
