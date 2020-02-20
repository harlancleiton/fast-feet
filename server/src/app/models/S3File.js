import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        key: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
