module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('deliverymen', 'shutdown_date', {
        type: Sequelize.DATE,
      }),

      queryInterface.addColumn('deliverymen', 'active', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('deliverymen', 'shutdown_date'),
      queryInterface.removeColumn('deliverymen', 'active'),
    ]);
  },
};
