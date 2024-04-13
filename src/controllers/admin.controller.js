import express from "express";
import UserDAO from "../dao/User.dao.js";
import UserRepository from "../repositories/User.repository.js";
import { adminAuthMiddleware, passportCall } from "../utils.js";
import { logger } from "../logger/factory.js";

const userDAO = new UserDAO();
const userRepository = new UserRepository(userDAO);

const router = express.Router();

router.put(
  "/user/:id/edit",
  passportCall("jwt"),
  adminAuthMiddleware(),
  async (req, res) => {
    const userId = req.params.id;
    const newRole = req.body.newRole;

    try {
      const user = await userRepository.findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin") {
        return res
          .status(403)
          .json({ message: "Cannot change role to 'admin'" });
      }

      user.role = newRole;
      await user.save();

      res
        .status(200)
        .json({ status: "success", message: "Role updated successfully" });
    } catch (error) {
      logger.error(`Error updating user's role, ${error.message}`);
      res
        .status(500)
        .json({ status: "error", message: "Error updating user's role" });
    }
  }
);

router.delete(
  "/user/:id/delete",
  passportCall("jwt"),
  adminAuthMiddleware(),
  async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await userRepository.findUserByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ status: "success", message: "User deleted successfully" });
    } catch (error) {
      logger.error(`Error removing user, ${error.message}`);
      res.status(500).json({ status: "error", message: "Error removing user" });
    }
  }
);

export default router;
