import Products from "./models/Products.model.js";

class ProductsDAO {
  constructor() {}

  async getAllProducts() {
    try {
      return await Products.find();
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await Products.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findProduct(productInfo) {
    try {
      return await Products.findOne(productInfo);
    } catch (error) {
      throw error;
    }
  }

  async findProductWithLean(id) {
    try {
      return await Products.findById(id).lean();
    } catch (error) {
      throw error;
    }
  }

  async createProduct(productInfo) {
    try {
      return await Products.create(productInfo);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, productUpdated) {
    try {
      const updatedProduct = await Products.findOneAndUpdate(
        { _id: productId },
        productUpdated,
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await Products.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async productsPaginate(filter, options) {
    try {
      const result = await Products.paginate(filter, options);

      const { limit, page, sort, query } = options;
      const queryLink = query ? `&query=${query}` : "";
      const sortLink = sort ? `&sort=${sort}` : "";

      return {
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
    } catch (error) {
      throw error;
    }
  }
}

export default ProductsDAO;
