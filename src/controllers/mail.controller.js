import express from "express";
import jwt from "jsonwebtoken";
import transport from "../utils/email.utils.js";
import emailConfig from "../config/email.config.js";
import config from "../config/dotenv.config.js";
import { createHash } from "../utils.js";
import UserDAO from "../dao/User.dao.js";
import UserRepository from "../repositories/User.repository.js";
import { logger } from "../logger/factory.js";

const router = express.Router();

const userDAO = new UserDAO();
const userRepository = new UserRepository(userDAO);

router.post("/sendmail", async (req, res) => {
  try {
    const { email } = req.body;

    const token = jwt.sign({ email }, config.SECRET_KEY, { expiresIn: "1h" });

    const resetLink = `http://localhost:${config.PORT}/resetpassword/${token}`;

    const mailOptions = {
      from: emailConfig.EMAIL_USER,
      to: email,
      subject: "Restablecer su contraseña",
      html: `<p>Click <a href="${resetLink}">aquí</a> para restablecer su contraseña.</p>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("Error sending email:", error);
        res
          .status(500)
          .json({ status: "error", message: "Error sending email" });
      } else {
        logger.info("Email sent:", info.response);
        res.status(200).json({ message: "Reset link sent successfully" });
      }
    });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, config.SECRET_KEY);

    res.render("index", { layout: "confirmResetPassword", token });
  } catch (error) {
    logger.error("Error", error);
    if (error.name === "TokenExpiredError") {
      logger.warn("Token expired");
      res.redirect("/send-reset-mail");
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const decodedToken = jwt.verify(token, config.SECRET_KEY);
    const email = decodedToken.email;

    const user = await userRepository.findUser({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password === password) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }
    const newHashedPassword = createHash(password);

    await userRepository.findOneAndUpdateField(
      { email },
      { password: newHashedPassword }
    );
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error("Error:", error);
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ message: "Token has expired" });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
});

export default router;
