import express from "express";
import { v4 as uuidv4 } from "uuid";

import CartsDAO from "../dao/Carts.dao.js";
import UserDAO from "../dao/User.dao.js";
import TicketDAO from "../dao/Ticket.dao.js";

import CartsRepository from "../repositories/Carts.repository.js";
import UserRepository from "../repositories/User.repository.js";
import TicketRepository from "../repositories/Ticket.repository.js";

import { passportCall, authorizationMiddleware } from "../utils.js";

const router = express.Router();

const cartsDAO = new CartsDAO();
const userDAO = new UserDAO();
const ticketDAO = new TicketDAO();

const cartsRepository = new CartsRepository(cartsDAO);
const userRepository = new UserRepository(userDAO);
const ticketRepository = new TicketRepository(ticketDAO);

router.post(
  "/",
  passportCall("jwt"),
  authorizationMiddleware(["user"]),
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const user = req.user;

      if (!user.user.cart)
        return res.status(400).send({ message: "User doesn't have a cart" });

      const cartId = user.user.cart;
      const cart = await cartsRepository.getCart(cartId);

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
  }
);

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await cartsRepository.findCartWithPopulate(
      cartId,
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(`Error getting cart ${err.message}`);
    res.status(500).json({ message: "Error getting cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartsRepository.getCart(cid);

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

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartsRepository.getCart(cartId);
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

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    const cart = await cartsRepository.getCart(cartId);
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

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const cart = await cartsRepository.getCart(cartId);
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

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await cartsRepository.getCart(cartId);
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

router.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productsNotPurchased = [];

    const user = await userRepository.findUser({ cart: cartId });
    const cart = await cartsRepository.findCartWithPopulate(
      cartId,
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (const cartProduct of cart.products) {
      const product = cartProduct.product;
      const productQuantity = cartProduct.quantity;

      if (product.stock >= productQuantity) {
        product.stock -= productQuantity;
        await product.save();
      } else {
        productsNotPurchased.push({
          product,
          quantity: productQuantity,
        });
      }
    }

    cart.products = cart.products.filter(
      (cartProduct) =>
        !productsNotPurchased.some((notPurchased) =>
          notPurchased.product._id.equals(cartProduct.product._id)
        )
    );

    const totalAmount = cart.products.reduce(
      (acc, cartProduct) => acc + cartProduct.product.price,
      0
    );

    const newTicket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: user.email,
    };

    await ticketRepository.createTicket(newTicket);

    if (productsNotPurchased.length > 0) {
      cart.products = productsNotPurchased;
    } else {
      cart.products = [];
    }

    await cart.save();

    return res.status(200).json({
      message: "Purchase completed successfully",
      totalAmount: totalAmount,
      productsNotPurchased:
        productsNotPurchased.length > 0
          ? productsNotPurchased.map((item) => item.product._id)
          : null,
    });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
