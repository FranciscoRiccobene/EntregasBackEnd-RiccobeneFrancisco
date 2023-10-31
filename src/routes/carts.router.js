import express from "express";
import CartManager from "../CartManager.js";
const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    console.error(`Error creating cart ${err}`);
    res.status(500).json({ message: "Error creating cart" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.status(200).json(cart.products);
    }
  } catch (err) {
    console.error(`Error getting cart ${err}`);
    res.status(500).json({ message: "Error getting cart" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  if (isNaN(cartId) || isNaN(productId)) {
    res.status(400).json({ message: "Invalid cart ID or product ID" });
    return;
  }

  try {
    const updatedCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );

    if (updatedCart) {
      res.status(200).json(updatedCart.products);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.error(`Error adding product to cart: ${err}`);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});

export { cartRouter };
