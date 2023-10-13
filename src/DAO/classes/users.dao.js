import UserModel from '../models/users.model.js';

class UsersDAO {
  async getAllUsersDao() {
    const users = await UserModel.find();
    return users;
  }
  catch(Error) {
    throw `Error finding all users`;
  }
  async getUserByIdDao(uid) {
    const user = await UserModel.findById(uid);
    return user;
  }
  catch(Error) {
    throw `Error finding user`;
  }
  async getUserByEmailDao(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error('Error finding user by email: ' + error.message);
    }
  }
  async updateUserDao(uid, userUpdate) {
    const updatedUser = await UserModel.findByIdAndUpdate(uid, userUpdate);
    return updatedUser;
  }
  catch(Error) {
    throw `Error updating user`;
  }
  async deleteUserDao(uid) {
    try {
      const user = await UserModel.findById(uid);
      if (!user) {
        throw new Error(`User with id ${uid} not found`);
      }
      const deletedUser = await UserModel.findByIdAndDelete(uid);
      if (!deletedUser) {
        throw new Error(`Failed to delete user with id: ${uid}`);
      }
      return deletedUser;
    } catch (error) {
      console.error('Error during user deletion:', error);
      throw error;
    }
  }
  async getInactiveUsersDao(lastConnectionDate) {
    const users = await UserModel.find({
      last_connection: { $lt: lastConnectionDate },
    });
    return users;
  }
  async deleteInactiveUsersDao(lastConnectionDate) {
    await UserModel.deleteMany({
      last_connection: { $lt: lastConnectionDate },
    });
  }
}

export default UsersDAO;
