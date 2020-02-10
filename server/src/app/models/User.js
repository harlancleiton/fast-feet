import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

import UserHook from './hooks/UserHook';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      {
        sequelize,
        hooks: {
          beforeSave: UserHook.hashPassword,
        },
      }
    );
  }

  checkPassword(rawPassword) {
    return bcrypt.compareSync(rawPassword, this.password);
  }
}

export default User;
