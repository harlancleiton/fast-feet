import jwt from 'jsonwebtoken';

import config from '../../config/auth';

class AuthMiddleware {
  async handle(req, res, next) {
    const authorization = req.header('Authorization');

    try {
      const [, token] = authorization.split(' ');

      const auth = jwt.verify(token, config.secret);
      req.auth = auth;

      return next();
    } catch (error) {
      return res.status(401).json();
    }
  }
}

export default new AuthMiddleware();
