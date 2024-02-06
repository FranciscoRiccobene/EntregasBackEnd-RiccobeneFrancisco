import { Router } from "express";
import UserDAO from "../dao/User.dao.js";
import CartsDAO from "../dao/Carts.dao.js";
import UserRepository from "../repositories/User.repository.js";
import CartsRepository from "../repositories/Carts.repository.js";
import config from "../config/dotenv.config.js";
import { createHash, isValidPassword, handleAuthentication } from "../utils.js";
import CustomError from "../utils/CustomError.error.js";
import { generateUserErrorInfo } from "../utils/info.error.js";
import EnumError from "../utils/enum.error.js";
import { logger } from "../logger/factory.js";

const router = Router();
const userDAO = new UserDAO();
const cartsDAO = new CartsDAO();
const userRepository = new UserRepository(userDAO);
const cartsRepository = new CartsRepository(cartsDAO);

router.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return next(
      CustomError.createError({
        name: "User registration error",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          email,
          age,
          password,
        }),
        message:
          "Error trying to register an user. Incomplete or invalid data.",
        code: EnumError.INVALID_TYPES_ERROR,
      })
    );
  }

  try {
    const findUser = await userRepository.findUser({ email });

    if (findUser)
      return res
        .status(400)
        .send({ status: "Error", error: "User already exists" });

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: "user",
    };

    await userRepository.createUser(newUser);

    res
      .status(200)
      .json({ status: "Success", message: "User registered successfully" });
  } catch (error) {
    logger.error("Internal Server Error");
    res.status(500).send({ status: "Error", error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
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
      const user = await userRepository.findUserWithPopulate(
        { email },
        {
          email: 1,
          first_name: 1,
          last_name: 1,
          age: 1,
          password: 1,
          role: 1,
          cart: 1,
        },
        "cart"
      );

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
        cart = await cartsRepository.createCart({ products: [] });
        user.cart = cart._id;
        await user.save();
      }

      delete user.password;
      handleAuthentication(user, res);
    }
  } catch (error) {
    logger.error(`Error, invalid credentials ${error.message}`);
    res.redirect("/error");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token");

  res.redirect("/login");
});

export default router;
