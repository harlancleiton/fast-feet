import bcrypt from 'bcryptjs';

class UserHook {
  hashPassword(user) {
    if (user.changed('password')) {
      const userChanged = user;
      userChanged.password = bcrypt.hashSync(
        userChanged.password,
        Number(process.env.SALT_ROUNDS) || 10
      );
      return userChanged;
    }

    return user;
  }
}

export default new UserHook();
