import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import S3File from '../app/models/S3File';
import Deliveryman from '../app/models/Deliveryman';
import Delivery from '../app/models/Delivery';
import DeliveryProblem from '../app/models/DeliveryProblem';

import config from '../config/database';

const models = [
  User,
  Recipient,
  S3File,
  Deliveryman,
  Delivery,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(config);

    models.forEach(model => model.init(this.connection));
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
