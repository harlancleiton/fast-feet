const bcrypt = require('bcryptjs');
const bcryptConfig = require('../../config/bcrypt');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Admin FastFeet',
          email: 'admin@fastfeet.com.br',
          password: bcrypt.hashSync(
            process.env.ADMIN_PASSWORD || 'admin',
            bcryptConfig.rounds
          ),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
