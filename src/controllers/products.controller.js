import express from "express";
import ProductsDAO from "../dao/Products.dao.js";
import UserDAO from "../dao/User.dao.js";
import ProductsRepository from "../repositories/Products.repository.js";
import {
  passportCall,
  authorizationMiddleware,
  updateLastConnectionMiddleware,
} from "../utils.js";
import UserService from "../services/userService.js";
import CustomError from "../utils/CustomError.error.js";
import EnumError from "../utils/enum.error.js";
import { generateProductErrorInfo } from "../utils/info.error.js";
import { logger } from "../logger/factory.js";

const router = express.Router();

const productsDAO = new ProductsDAO();
const userDAO = new UserDAO();

const productsRepository = new ProductsRepository(productsDAO);
const userService = new UserService(userDAO);

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "desc"
          ? { price: -1 }
          : sort === "asc"
          ? { price: 1 }
          : undefined,
    };

    const filter = query
      ? query === "stock"
        ? { stock: { $gt: 0 } }
        : {
            $or: [
              { title: new RegExp(query, "i") },
              { category: new RegExp(query, "i") },
            ],
          }
      : {};

    const result = await productsRepository.productsPaginate(filter, options);

    res.status(200).json(result);
  } catch (err) {
    logger.error(`Error reading products from database: ${err}`);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  const productId = req.params.pid;

  try {
    const obtainedProduct = await productsRepository.getProductById(productId);

    if (obtainedProduct) {
      res.status(200).json({ product: obtainedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    logger.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/",
  passportCall("jwt"),
  authorizationMiddleware(["admin", "premium"]),
  updateLastConnectionMiddleware,
  async (req, res, next) => {
    const { title, description, code, price, status, stock, category } =
      req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return next(
        CustomError.createError({
          name: "Product creation error",
          cause: generateProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
          }),
          message: "Error creating product",
          code: EnumError.INVALID_TYPES_ERROR,
        })
      );
    }

    try {
      const existingProduct = await productsRepository.findProduct({ code });
      if (existingProduct) {
        return res.status(400).json({ message: "The code is already in use" });
      }

      const currentUser = req.user;
      const owner =
        currentUser.user.role === "premium" ? currentUser.user.email : null;

      const newProductData = { ...req.body, owner: owner };
      const newProduct = await productsRepository.createProduct(newProductData);

      res.status(201).json({
        message: "Product created successfully",
        newProduct: newProduct,
      });
    } catch (err) {
      logger.error(`Error adding product: ${err}`);
      res.status(500).json({ message: "Error adding product" });
    }
  }
);

router.put(
  "/:pid",
  passportCall("jwt"),
  authorizationMiddleware(["admin", "premium"]),
  updateLastConnectionMiddleware,
  async (req, res) => {
    try {
      const productId = req.params.pid;
      const productUpdate = req.body;

      const updatedProduct = await productsRepository.updateProduct(
        productId,
        productUpdate
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        updatedProduct: updatedProduct,
      });
    } catch (err) {
      logger.error(`Error updating product: ${err}`);
      res.status(500).json({ message: "Error updating product" });
    }
  }
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorizationMiddleware(["admin", "premium"]),
  updateLastConnectionMiddleware,
  async (req, res) => {
    const productId = req.params.pid;

    try {
      const productToDelete = await productsRepository.deleteProduct(productId);

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (productToDelete.owner) {
        await userService.sendEmail(
          productToDelete.owner,
          "Product deleted",
          "Your product has been deleted."
        );
      }

      res.status(204).json({ message: "Product deleted successfully" });
    } catch (err) {
      logger.error(`Error deleting product: ${err}`);
      res.status(500).json({ message: "Error deleting product" });
    }
  }
);

export default router;
