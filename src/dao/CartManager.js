import fs from "fs";

class CartManager {
  constructor() {
    this.carts = this.readCartsFromFile();
    this.path = "src/carrito.json";
  }

  async writeCartsToFile(carts) {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
    } catch (err) {
      console.error(`Error writing to file: ${err}`);
    }
  }

  async readCartsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getCarts() {
    const carts = await this.readCartsFromFile();
    return carts;
  }

  async createCart() {
    const carts = await this.getCarts();

    const id = carts.length + 1;
    const cart = {
      id: id,
      products: [],
    };
    carts.push(cart);
    await this.writeCartsToFile(carts);
    return cart;
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    const obtainedCart = carts.find((cart) => cart.id === cartId);
    return obtainedCart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      return null;
    }
    const existingProduct = cart.products.find(
      (product) => product.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await this.writeCartsToFile(carts);

    return cart;
  }
}

export default CartManager;
