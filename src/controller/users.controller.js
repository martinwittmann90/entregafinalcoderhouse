import { logger } from '../utils/logger.js';
import ServiceUsers from '../services/users.service.js';
import dotenv from 'dotenv';
import UserModel from '../DAO/models/users.model.js';
dotenv.config();
const serviceUsers = new ServiceUsers();

class UserController {
  async userDataBase(req, res) {
    try {
      const userBaseData = await serviceUsers.getAllUsersService();
      const totalUsers = userBaseData.map((user) => {
        return {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          age: user.age,
          cartID: user.cartID,
          last_connection: user.last_connection,
        };
      });
      logger.info(`User data base loaded`, totalUsers);
      logger.debug('Rendering admin page');
      res.status(200).render('admincontroller', { users: totalUsers });
    } catch (err) {
      logger.error('Error getting cart by ID:', err);
      res.status(404).json({ status: 'error', message: 'Error loading data base' });
    }
  }

  async renderChangeUserRole(req, res) {
    try {
      const { uid } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.render('changeUserRole', { user });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error: Can not change user role' });
    }
  }

  async changeUserRole(req, res) {
    try {
      const { uid } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role === 'premium') {
        if (
          !user.documents ||
          !user.documents.some((document) => document.documentType === 'identificación') ||
          !user.documents.some((document) => document.documentType === 'comprobanteDomicilio') ||
          !user.documents.some((document) => document.documentType === 'comprobanteEstadoCuenta')
        ) {
          return res.status(403).json({ message: 'El usuario no ha terminado de procesar su documentación.' });
        }
      }
      user.role = req.body.role;
      await user.save();
      res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error: Unable to update user role' });
    }
  }
  async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const uploadedFiles = req.files;
      user.documents.push(
        ...uploadedFiles.map((file) => {
          return {
            name: file.originalname,
            link: `${req.protocol}://${req.get('host')}/api/documents/${file.filename}`,
            status: 'completed',
            statusVerified: true,
            documentType: req.body.documentType,
          };
        })
      );
      await user.save();
      res.status(200).redirect('/api/sessions/current');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error: Unable to upload documents' });
    }
  }
  async uploadProfileImage(req, res) {
    try {
      const { uid } = req.params;
      const profileImage = req.file;
      await UserModel.findOneAndUpdate({ _id: uid }, { profileImage: profileImage.filename });
      res.locals.profileImage = profileImage.filename;
      res.status(200).redirect('/api/sessions/current');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar la imagen de perfil' });
    }
  }
  async completeDocument(req, res) {
    try {
      const { uid, documentName } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const document = user.documents.find((document) => document.name === documentName);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      document.statusVerified = true;
      await user.save();
      res.status(200).json({ message: 'Document completed successfully' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error: Unable to complete document' });
    }
  }
  async updateUser(req, res) {
    try {
      const uid = req.params.uid;
      const userUpdate = req.body;
      const updatedUser = await serviceUsers.updateUserService(uid, userUpdate);
      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'User updated',
        payload: updatedUser,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
  async deleteOneUsers(req, res) {
    try {
      const uid = req.params.uid;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          msg: 'User not found',
        });
      }
      const deletedUser = await serviceUsers.deleteUserService(uid);
      if (!deletedUser) {
        return res.status(404).json({
          status: 'error',
          msg: 'User not found in the database',
        });
      }
      return res.status(200).json({
        status: 'success',
        msg: 'User deleted',
        payload: deletedUser,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ status: 'error', msg: error.message });
    }
  }
  async deleteInactiveUsers(req, res) {
    try {
      await serviceUsers.deleteInactiveUsersService();
      res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente.' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Se produjo un error al eliminar usuarios inactivos.' });
    }
  }
}

export default UserController;
