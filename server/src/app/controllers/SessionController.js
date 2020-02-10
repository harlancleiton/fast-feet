import jwt from 'jsonwebtoken';

import config from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json();

    if (!user.checkPassword(password)) return res.status(401).json();

    const { id, name } = user;

    const token = jwt.sign({ id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    return res.json({ user: { id, name, email }, token });
  }
}

export default new SessionController();
