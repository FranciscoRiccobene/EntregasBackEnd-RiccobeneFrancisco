import { appConfig } from "../config/app.config.js";

export const getLogger = async () => {
  let response;
  switch (appConfig.environment) {
    case "development":
      console.log("dev");
      response = await import("./dev.logger.js");
      break;
    case "production":
      console.log("prod");
      response = await import("./prod.logger.js");
      break;

    default:
      break;
  }
  console.log(response);
  return response;
};
