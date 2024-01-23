class CartsRepository {
  constructor(cartsDAO) {
    this.cartsDAO = cartsDAO;
  }

  async getCart(id) {
    return await this.cartsDAO.getCart(id);
  }

  async findCartWithPopulate(id, fieldsPopulate) {
    return await this.cartsDAO.findCartWithPopulate(id, fieldsPopulate);
  }

  async findCartWithPopulateAndLean(id, fieldsPopulate) {
    return await this.cartsDAO.findCartWithPopulateAndLean(id, fieldsPopulate);
  }

  async createCart(cartIndo) {
    return await this.cartsDAO.createCart(cartIndo);
  }
}

export default CartsRepository;
