module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliverymen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatar_id: {
        type: Sequelize.INTEGER,
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
          model: 's_3_files',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliverymen');
  },
};
