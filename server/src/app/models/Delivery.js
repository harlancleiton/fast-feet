import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        startDate: Sequelize.DATE,
        endDate: Sequelize.DATE,
        canceledAt: Sequelize.DATE,
      },
      { sequelize, tableName: 'deliveries' }
    );
  }

  static associate(models) {
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.S3File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.hasMany(models.DeliveryProblem, {
      foreignKey: 'delivery_id',
      as: 'deliveryProblem',
    });
  }
}

export default Delivery;
