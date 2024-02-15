import User from "./models/User.model.js";
import UserDTO from "./DTOs/User.dto.js";

class UserDAO {
  constructor() {}

  async findUser(userInfo) {
    try {
      return await User.findOne(userInfo);
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findUserWithPopulate(userInfo, fieldsSelect, fieldsPopulate) {
    try {
      return await User.findOne(userInfo)
        .select(fieldsSelect)
        .populate(fieldsPopulate);
    } catch (error) {
      throw error;
    }
  }

  async createUser(userInfo) {
    try {
      const newUserInfo = new UserDTO(userInfo);
      newUserInfo.password = userInfo.password;
      return await User.create(newUserInfo);
    } catch (error) {
      throw error;
    }
  }

  async findOneAndUpdateField(userInfo, updateInfo) {
    try {
      return await User.findOneAndUpdate(userInfo, updateInfo);
    } catch (error) {
      throw error;
    }
  }
}

export default UserDAO;
