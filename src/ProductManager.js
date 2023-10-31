import fs from "fs";

class ProductManager {
  constructor() {
    this.products = this.readProductsFromFile();
    this.path = "products.json";
  }

  async writeProductsToFile(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
  }

  async readProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProducts() {
    const products = await this.readProductsFromFile();
    return products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const obtainedProduct = products.find((product) => product.id === id);
    return obtainedProduct;
  }

  async updateProduct(id, newProductData) {
    const productsFromFile = await this.getProducts();
    const productToUpdate = await this.getProductById(id);

    if (productToUpdate && productToUpdate !== "Product not found") {
      for (const key in newProductData) {
        if (key !== "id") {
          productToUpdate[key] = newProductData[key];
        } else {
          console.warn("Modifying ID product is not allowed");
        }
      }
      const updatedProduct = productsFromFile.map((product) =>
        product.id === id ? productToUpdate : product
      );
      await this.writeProductsToFile(updatedProduct);
      return "Product updated";
    } else {
      return "Product not found";
    }
  }

  async deleteProduct(id) {
    const productsFromFile = await this.getProducts();
    const productToDelete = productsFromFile.findIndex(
      (product) => product.id === id
    );

    if (productToDelete !== -1) {
      productsFromFile.splice(productToDelete, 1);
      await this.writeProductsToFile(productsFromFile);
      return "Product deleted";
    } else {
      return "Product not found";
    }
  }
}

export default ProductManager;
