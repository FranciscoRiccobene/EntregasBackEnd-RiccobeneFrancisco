import express from "express";
import ProductManager from "../ProductManager.js";
const productRouter = express.Router();
const productManager = new ProductManager();

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json({ products: limitedProducts });
    } else {
      res.status(200).json({ products });
    }
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Serve Error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const obtainedProduct = await productManager.getProductById(productId);

    if (obtainedProduct) {
      res.status(200).json({ product: obtainedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Serve Error" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

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

    const verifyCode = products.find((product) => product.code === code);
    if (verifyCode) {
      return res.status(400).json({ message: "The code is already in use" });
    }

    const id = products.length + 1;
    const newProduct = {
      id: id,
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails || [],
    };

    products.push(newProduct);
    await productManager.writeProductsToFile(products);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(`Error adding product: ${err}`);
    res.status(500).json({ message: "Error adding product" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const uptdatedFields = req.body;

  try {
    const data = await productManager.updateProduct(productId, uptdatedFields);

    if (data === "Product updated") {
      res.status(201).json({ message: "Product updated" });
    } else if (data === "Product not found") {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error updating product: ${err}`);
    res.status(500).json({ message: "Error updating product" });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const data = await productManager.deleteProduct(productId);

    if (data === "Product deleted") {
      res.status(204).json({ message: "Product deleted" });
    } else if (data === "Product not found") {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error deleting product: ${err}`);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export { productRouter };
