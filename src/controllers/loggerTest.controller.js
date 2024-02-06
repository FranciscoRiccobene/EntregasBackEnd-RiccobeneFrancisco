import express from "express";
import { logger } from "../logger/factory.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    logger.debug("Esto es un mensaje de debug");

    logger.http("Esto es un mensaje HTTP");

    logger.info("Esto es un mensaje de info");

    logger.warn("Esto es un mensaje de warning");

    logger.error("Esto es un mensaje de error");

    logger.fatal("Esto es un mensaje fatal");

    res.status(200).send({ message: "Loggers working properly" });
  } catch (error) {
    logger.error(`Error testing logs: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
