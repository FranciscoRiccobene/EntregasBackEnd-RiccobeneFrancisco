import express from "express";
import generateProducts from "../utils/mock.utils.js";
import { logger } from "../logger/factory.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const count = parseInt(req.query.count) || 100;

    const mockedProducts = Array.from({ length: count }, generateProducts);
    res.status(200).json(mockedProducts);
  } catch (error) {
    logger.error(`Error mocking product: ${error}`);
    res.status(500).json({ message: "Error mocking product" });
  }
});

export default router;
