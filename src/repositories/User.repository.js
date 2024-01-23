class UserRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async findUser(userInfo) {
    return await this.userDAO.findUser(userInfo);
  }

  async findUserWithPopulate(userInfo, fieldsSelect, fieldsPopulate) {
    return await this.userDAO.findUserWithPopulate(
      userInfo,
      fieldsSelect,
      fieldsPopulate
    );
  }

  async createUser(userInfo) {
    return await this.userDAO.createUser(userInfo);
  }
}

export default UserRepository;
