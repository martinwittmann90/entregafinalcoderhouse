import UsersDAO from '../DAO/classes/users.dao.js';
import { mailController } from '../controller/messages.controller.js';

const usersDAO = new UsersDAO();
class ServiceUsers {
  async getAllUsersService() {
    try {
      const users = await usersDAO.getAllUsersDao();
      return users;
    } catch (err) {
      throw err;
    }
  }
  async getUserByIdService(uid) {
    try {
      const user = await usersDAO.getUserByIdDao({ _id: uid });
      return user;
    } catch (err) {
      throw new CustomError(`No se encontró user de id ${id}.`);
    }
  }
  async getUserByEmailService(email) {
    try {
      const user = await usersDAO.getUserByEmailDao(email);
      return user;
    } catch (error) {
      throw new Error('Error getting user by email: ' + error.message);
    }
  }
  async updateUserService(uid, userUpdate) {
    const updatedUser = await usersDAO.updateUserDao(uid, userUpdate);
    return updatedUser;
  }
  async deleteUserService(uid) {
    try {
      const deletedUser = await usersDAO.deleteUserDao(uid);
      return deletedUser;
    } catch (error) {
      throw new Error(`Service: Failed to delete user with id: ${uid}`);
    }
  }
  async deleteInactiveUsersService() {
    const lastConnectionDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const users = await usersDAO.getInactiveUsersDao(lastConnectionDate);
    for (const user of users) {
      mailController.sendMail({
        to: user.email,
        subject: 'Cuenta eliminada por inactividad',
        text: `Estimado ${user.firstName}, Su cuenta ha sido eliminada por inactividad. Si desea recuperarla, por favor póngase en contacto con nosotros.`,
      });
    }
    await usersDAO.deleteInactiveUsersDao(lastConnectionDate);
  }
}

export default ServiceUsers;
