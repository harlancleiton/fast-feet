import { Router } from 'express';
import { Op } from 'sequelize';

import SessionController from './app/controllers/SessionController';
import MeController from './app/controllers/MeController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';

import AuthMiddleware from './app/middlewares/AuthMiddleware';
import ValidatorMiddleware from './app/middlewares/ValidatorMiddleware';
import Login from './app/validators/Login';
import MulterMiddleware from './app/middlewares/MulterMiddleware';
import WhereMiddleware from './app/middlewares/WhereMiddleware';

const routes = new Router();

routes.post('/sessions', ValidatorMiddleware(Login), SessionController.store);

routes.use(AuthMiddleware);

routes.get('/me', MeController.index);

routes.get('/recipients/:id', RecipientController.show);
routes.get(
  '/recipients',
  WhereMiddleware(
    { op: Op.iLike, name: 'name' },
    { op: Op.iLike, name: 'city' },
    { op: Op.iLike, name: 'state' },
    { op: Op.iLike, name: 'cep' }
  ),
  RecipientController.index
);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post(
  '/deliverymen',
  MulterMiddleware('avatar'),
  DeliverymanController.store
);

export default routes;
