import User from "./models/User.model.js";
import UserDTO from "./DTOs/User.dto.js";
import UserService from "../services/userService.js";

class UserDAO {
  constructor() {}

  async findAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw error;
    }
  }

  async findUsersWithLean() {
    try {
      return await User.find().lean();
    } catch (error) {
      throw error;
    }
  }

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

  async findUserByIdAndDelete(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw error;
    }
  }

  async deleteInactiveUsers(days) {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - days);

      const usersToDelete = await User.find({
        lastConnection: { $lt: twoDaysAgo },
      });

      const deleteInfo = await User.deleteMany({
        lastConnection: { $lt: twoDaysAgo },
      });

      return usersToDelete;
    } catch (error) {
      throw error;
    }
  }
}

export default UserDAO;
