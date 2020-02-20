import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import S3File from '../app/models/S3File';

import config from '../config/database';

const models = [User, Recipient, S3File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(config);

    models.forEach(model => model.init(this.connection));
  }
}

export default new Database();
