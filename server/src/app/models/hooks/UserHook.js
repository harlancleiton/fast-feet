import bcrypt from 'bcryptjs';

import bcryptConfig from '../../../config/bcrypt';

class UserHook {
  hashPassword(user) {
    if (user.changed('password')) {
      const userChanged = user;
      userChanged.password = bcrypt.hashSync(
        userChanged.password,
        bcryptConfig.rounds
      );
      return userChanged;
    }

    return user;
  }
}

export default new UserHook();
