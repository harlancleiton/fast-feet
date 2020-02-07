import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Harlan Cleiton',
    email: 'harlancleiton@gmail.com',
    password: '123',
  });

  return res.json(user);
});

export default routes;
