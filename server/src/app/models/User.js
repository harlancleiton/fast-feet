import Sequelize, { Model } from 'sequelize';

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
}

export default User;
