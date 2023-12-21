import express from "express";
import { passportCall } from "../utils.js";
import Products from "../models/products.model.js";
import Carts from "../models/carts.model.js";

const viewRouter = express.Router();

viewRouter.get("/", (req, res) => {
  res.render("index", {});
});

viewRouter.get("/register", (req, res) => {
  res.render("index", { layout: "register" });
});

viewRouter.get("/login", (req, res) => {
  res.render("index", { layout: "login" });
});

viewRouter.get("/current", passportCall("jwt"), (req, res) => {
  res.render("index", { layout: "current", user: req.user});
});

viewRouter.get("/products", async (req, res) => {
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
      lean: true,
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
        ? `/products?page=${result.prevPage}&limit=${limit}${queryLink}${sortLink}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${limit}${queryLink}${sortLink}`
        : null,
    };

    res.render("index", { layout: "products", products: response });
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

viewRouter.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await Products.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.render("index", { layout: "productsDetail", product: product });
  } catch (error) {
    console.error(`Error reading products file: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

viewRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Carts.findById(cartId)
      .populate("products.product")
      .lean();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.render("index", { layout: "cartDetail", cart });
  } catch (error) {
    console.error(`Error fetching the cart: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { viewRouter };
