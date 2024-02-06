import EnumError from "../../utils/enum.error.js";
import { logger } from "../../logger/factory.js";

export default (error, req, res, next) => {
  logger.error(error.cause);

  switch (error.code) {
    case EnumError.INVALID_TYPES_ERROR:
      res.status(400).json({ error: error.name });
      break;

    case EnumError.DATABASE_ERROR:
      res.status(500).json({ error: error.name });
      break;

    case EnumError.ROUTING_ERROR:
      res.status(500).json({ error: error.name });
      break;

    default:
      res.json({ error: "Unable error" });
  }
};
