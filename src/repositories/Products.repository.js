class ProductsRepository {
  constructor(productsDAO) {
    this.productsDAO = productsDAO;
  }

  async getAllProducts() {
    return await this.productsDAO.getAllProducts();
  }

  async getProductById(id) {
    return await this.productsDAO.getProductById(id);
  }

  async findProduct(productInfo) {
    return await this.productsDAO.findProduct(productInfo);
  }

  async findProductWithLean(id) {
    return await this.productsDAO.findProductWithLean(id);
  }

  async createProduct(productInfo) {
    return await this.productsDAO.createProduct(productInfo);
  }

  async updateProduct(productId, productUpdated) {
    return await this.productsDAO.updateProduct(productId, productUpdated);
  }

  async deleteProduct(id) {
    return await this.productsDAO.deleteProduct(id);
  }

  async productsPaginate(filter, options) {
    return await this.productsDAO.productsPaginate(filter, options);
  }
}

export default ProductsRepository;
