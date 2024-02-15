class UserRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async findUser(userInfo) {
    return await this.userDAO.findUser(userInfo);
  }

  async findUserById(id) {
    return await this.userDAO.findUserById(id);
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

  async findOneAndUpdateField(userInfo, updateInfo) {
    return await this.userDAO.findOneAndUpdateField(userInfo, updateInfo);
  }
}

export default UserRepository;
