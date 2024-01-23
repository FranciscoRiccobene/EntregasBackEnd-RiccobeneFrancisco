import Carts from "./models/Carts.model.js";

class CartsDAO {
  constructor() {}

  async getCart(id) {
    try {
      return await Carts.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findCartWithPopulate(id, fieldsPopulate) {
    try {
      return await Carts.findById(id).populate(fieldsPopulate);
    } catch (error) {
      throw error;
    }
  }

  async findCartWithPopulateAndLean(id, fieldsPopulate) {
    try {
      return await Carts.findById(id).populate(fieldsPopulate).lean();
    } catch (error) {
      throw error;
    }
  }

  async createCart(cartInfo) {
    try {
      return await Carts.create(cartInfo);
    } catch (error) {
      throw error;
    }
  }
}

export default CartsDAO;
