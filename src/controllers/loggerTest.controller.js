import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    req.logger.debug("Esto es un mensaje de debug");

    req.logger.http("Esto es un mensaje HTTP");

    req.logger.info("Esto es un mensaje de info");

    req.logger.warning("Esto es un mensaje de warning");

    req.logger.error("Esto es un mensaje de error");

    req.logger.fatal("Esto es un mensaje fatal");
  } catch (error) {
    req.logger.error(`Error testing logs: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
