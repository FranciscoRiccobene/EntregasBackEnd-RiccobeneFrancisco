import express from "express";
import ProductsDAO from "../dao/Products.dao.js";
import ProductsRepository from "../repositories/Products.repository.js";
import { passportCall, authorizationMiddleware } from "../utils.js";
import CustomError from "../utils/CustomError.error.js";
import EnumError from "../utils/enum.error.js";
import { generateProductErrorInfo } from "../utils/info.error.js";

const router = express.Router();
const productsDAO = new ProductsDAO();
const productsRepository = new ProductsRepository(productsDAO);

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
    req.logger.error(`Error reading products from database: ${err}`);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const obtainedProduct = await productsRepository.getProductById(
      req.params.pid
    );

    if (obtainedProduct) {
      res.status(200).json({ product: obtainedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    req.logger.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/",
  passportCall("jwt"),
  authorizationMiddleware(["admin"]),
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

      const newProduct = await productsRepository.createProduct(req.body);

      res.status(201).json(newProduct);
    } catch (err) {
      req.logger.error(`Error adding product: ${err}`);
      res.status(500).json({ message: "Error adding product" });
    }
  }
);

router.put(
  "/:pid",
  passportCall("jwt"),
  authorizationMiddleware(["admin"]),
  async (req, res) => {
    try {
      const productId = req.params.pid;
      const productUpdate = req.body;

      const updatedProduct = await productsRepository.updateProduct(
        productId,
        productUpdate
      );

      if (!updatedProduct) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json(updatedProduct);
      }
    } catch (err) {
      req.logger.error(`Error updating product: ${err}`);
      res.status(500).json({ message: "Error updating product" });
    }
  }
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorizationMiddleware(["admin"]),
  async (req, res) => {
    try {
      const productToDelete = await productsRepository.deleteProduct(
        req.params.pid
      );

      if (!productToDelete) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(204).json({ message: "Product deleted" });
      }
    } catch (err) {
      req.logger.error(`Error deleting product: ${err}`);
      res.status(500).json({ message: "Error deleting product" });
    }
  }
);

export default router;
