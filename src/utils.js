import { fileURLToPath } from "url";
import { dirname } from "path";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "./logger/factory.js";
import UserDAO from "./dao/User.dao.js";
import UserRepository from "./repositories/User.repository.js";
import ProductsDAO from "./dao/Products.dao.js";
import ProductsRepository from "./repositories/Products.repository.js";

const productsDAO = new ProductsDAO();
const userDAO = new UserDAO();

const productsRepository = new ProductsRepository(productsDAO);
const userRepository = new UserRepository(userDAO);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1d" });
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .send({ error: info.message?.info, message: info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const handleAuthentication = (user, res) => {
  const token = generateToken(user);

  res
    .cookie("access_token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .send({ message: "Success" });
};

export const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || !allowedRoles.includes(currentUser.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      currentUser.user.role === "premium" &&
      (req.method === "PUT" || req.method === "DELETE")
    ) {
      const productId = req.params.pid;

      productsRepository
        .getProductById(productId)
        .then((product) => {
          if (!product || product.owner !== currentUser.user.email) {
            return res.status(403).json({ message: "Access denied" });
          }

          next();
        })
        .catch((err) => {
          logger.error(`Error finding product: ${err}`);
          res.status(500).json({ message: "Error finding product" });
        });
    } else {
      next();
    }
  };
};

export const adminAuthMiddleware = () => {
  return (req, res, next) => {
    const adminUser = req.user;

    if (!adminUser || adminUser.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

export const updateLastConnectionMiddleware = (req, res, next) => {
  const currentUser = req.user;

  if (
    currentUser &&
    (currentUser.user.role === "user" || currentUser.user.role === "premium")
  ) {
    userRepository.findOneAndUpdateField(
      { email: currentUser.user.email },
      {
        lastConnection: new Date(),
      }
    );
  }
  next();
};

export default __dirname;
