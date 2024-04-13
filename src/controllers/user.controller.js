import express from "express";
import UserDAO from "../dao/User.dao.js";
import UserRepository from "../repositories/User.repository.js";
import UserService from "../services/userService.js";
import { adminAuthMiddleware, passportCall } from "../utils.js";
import { logger } from "../logger/factory.js";

const userDAO = new UserDAO();

const userRepository = new UserRepository(userDAO);
const userService = new UserService(userDAO);

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    const filteredUsers = users.map((user) => {
      return {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
      };
    });

    res.status(200).json({
      status: "success",
      data: { users: filteredUsers, total: filteredUsers.length },
    });
  } catch (error) {
    logger.error(`Error obtaining users, ${error.message}`);
    res.status(500).json({ status: "error", message: "Error obtaining users" });
  }
});

router.put(
  "/premium/:uid",
  passportCall("jwt"),
  adminAuthMiddleware(),
  async (req, res) => {
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
      await user.save();

      res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
      logger.error(`Error updating user role: ${error}`);
      res
        .status(500)
        .json({ status: "error", message: "Error updating user role" });
    }
  }
);

router.delete(
  "/",
  passportCall("jwt"),
  adminAuthMiddleware(),
  async (req, res) => {
    try {
      const deletedUsers = await userRepository.deleteInactiveUsers(2);

      if (deletedUsers.length === 0) {
        return res
          .status(200)
          .json({ message: "There are no inactive users to delete" });
      }

      for (const user of deletedUsers) {
        await userService.sendEmail(
          user.email,
          "Account deleted",
          "¡Sorry! Your account has been removed due to inactivity."
        );
      }

      res
        .status(200)
        .json({ status: "success", message: "Users deleted successfully" });
    } catch (error) {
      logger.error(`Error deleting users due to inactivity: ${error.message}`);
      res
        .status(500)
        .json({ status: "error", message: "Error deleting users" });
    }
  }
);

export default router;
