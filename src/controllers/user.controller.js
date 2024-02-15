import express from "express";
import UserDAO from "../dao/User.dao.js";
import UserRepository from "../repositories/User.repository.js";
import { logger } from "../logger/factory.js";

const userDAO = new UserDAO();
const userRepository = new UserRepository(userDAO);

const router = express.Router();

router.put("/premium/:uid", async (req, res) => {
  const userId = req.params.uid;
  const newRole = req.body.role;

  try {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newRole !== "user" && newRole !== "premium") {
      return res.status(403).json({ message: "Invalid role" });
    }

    user.role = newRole;
    logger.info(user);
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    logger.error(`Error updating user role: ${error}`);
    res
      .status(500)
      .json({ status: "error", message: "Error updating user role" });
  }
});

export default router;
