import express from "express";
import Carts from "../models/carts.model.js";
import { passportCall } from "../utils.js";

const cartRouter = express.Router();

cartRouter.post("/", passportCall("jwt"), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user;

    if (!user.user.cart)
      return res.status(400).send({ message: "User doesn't have a cart" });

    const cartId = user.user.cart;
    const cart = await Carts.findById(cartId);

    const existingProduct = cart.products.find(
      (product) => product.product && product.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity, 10) || 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: parseInt(quantity, 10) || 1,
      });
    }

    await cart.save();

    res.status(201).json({ message: "Products added to cart successfully" });
  } catch (err) {
    console.error(`Error creating cart ${err}`);
    res.status(500).json({ message: "Error creating cart" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Carts.findById(cartId).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(`Error getting cart ${err.message}`);
    res.status(500).json({ message: "Error getting cart" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Carts.findById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingProduct = cart.products.find((p) => p.product.equals(pid));

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: pid, quantity: quantity || 1 });
    }

    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error(`Error adding product to cart: ${err}`);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await Carts.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productId)
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    const cart = await Carts.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = newProducts;

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const cart = await Carts.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productToUpdate = cart.products.find((p) =>
      p.product.equals(productId)
    );
    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    productToUpdate.quantity = newQuantity;

    await cart.save();

    res.status(200).json({ message: "Product quantity updated succesfully" });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Carts.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({ message: "All products removed from Cart" });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { cartRouter };
