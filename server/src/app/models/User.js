import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

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
          beforeSave: user => {
            if (user.changed('password')) {
              const userChanged = user;
              userChanged.password = bcrypt.hashSync(userChanged.password);
              return userChanged;
            }

            return user;
          },
        },
      }
    );
  }
}

export default User;
