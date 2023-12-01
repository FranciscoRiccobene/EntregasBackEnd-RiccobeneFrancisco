import express from "express";
import Products from "../models/products.model.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "desc" ? { price: -1 } : sort === "asc" ? { price: 1 } : undefined,
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

    const result = await Products.paginate(filter, options);

    const queryLink = query ? `&query=${query}` : "";
    const sortLink = sort ? `&sort=${sort}` : "";

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}&limit=${limit}${queryLink}${sortLink}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}&limit=${limit}${queryLink}${sortLink}`
        : null,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(`Error reading products from database: ${err}`);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const obtainedProduct = await Products.findById(req.params.pid);

    if (obtainedProduct) {
      res.status(200).json({ product: obtainedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingProduct = await Products.findOne({ code });
  if (existingProduct) {
    return res.status(400).json({ message: "The code is already in use" });
  }

  const products = new Products(req.body);

  try {
    const newProduct = await products.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(`Error adding product: ${err}`);
    res.status(500).json({ message: "Error adding product" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const productToUpdate = await Products.findOneAndUpdate(
      { _id: req.params.pid },
      req.body,
      { new: true }
    );

    if (!productToUpdate) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(productToUpdate);
    }
  } catch (err) {
    console.error(`Error updating product: ${err}`);
    res.status(500).json({ message: "Error updating product" });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const productToDelete = await Products.findByIdAndDelete(req.params.pid);

    if (!productToDelete) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(204).json({ message: "Product deleted" });
    }
  } catch (err) {
    console.error(`Error deleting product: ${err}`);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export { productRouter };
