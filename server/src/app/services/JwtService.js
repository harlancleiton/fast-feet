import jwt from 'jsonwebtoken';

import config from '../../config/auth';
import User from '../models/User';

class JwtService {
  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user || !user.checkPassword(password)) return null;

    const { id, name } = user;

    const token = jwt.sign({ id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    return { user: { id, name, email }, token };
  }
}

export default new JwtService();
