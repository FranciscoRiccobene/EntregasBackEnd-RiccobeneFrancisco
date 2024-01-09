import { Router } from "express";
import User from "../models/user.model.js";
import Carts from "../models/carts.model.js";
import config from "../config/dotenv.config.js";
import { createHash, isValidPassword, handleAuthentication } from "../utils.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password)
    return res
      .status(400)
      .send({ status: "Error", error: "Incomplete values" });

  const findUser = await User.findOne({ email });

  if (findUser)
    return res
      .status(400)
      .send({ status: "Error", error: "User already exists" });

  try {
    const result = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      age: age,
      password: createHash(password),
      role: "user",
    });

    res
      .status(200)
      .json({ status: "Success", message: "User registered successfully" });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(500).send({ status: "Error", error: "Internal Server Error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_EMAIL = config.ADMIN_EMAIL;
    const ADMIN_PASSWORD = config.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = {
        first_name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
      };

      handleAuthentication(user, res);
    } else {
      const user = await User.findOne(
        { email },
        {
          email: 1,
          first_name: 1,
          last_name: 1,
          age: 1,
          password: 1,
          role: 1,
          cart: 1,
        }
      ).populate("cart");

      if (!user)
        return res
          .status(401)
          .send({ status: "Error", error: "User or password incorrect 1" });

      if (!isValidPassword(user, password))
        return res
          .status(401)
          .send({ status: "Error", error: "User or password incorrect 2" });

      let cart = user.cart;
      if (!cart) {
        cart = await Carts.create({ products: [] });
        user.cart = cart._id;
        await user.save();
      }

      delete user.password;
      handleAuthentication(user, res);
    }
  } catch (error) {
    console.error(`Error, invalid credentials ${error.message}`);
    res.redirect("/error");
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("access_token");

  res.redirect("/login");
});

export { authRouter };
