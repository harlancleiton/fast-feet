import { Router } from 'express';
import { Op } from 'sequelize';
import { UI } from 'bull-board';

import SessionController from './app/controllers/SessionController';
import MeController from './app/controllers/MeController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';

import AuthMiddleware from './app/middlewares/AuthMiddleware';
import ValidatorMiddleware from './app/middlewares/ValidatorMiddleware';
import Login from './app/validators/Login';
import MulterMiddleware from './app/middlewares/MulterMiddleware';
import WhereMiddleware, {
  transformLikeable,
} from './app/middlewares/WhereMiddleware';

const routes = new Router();

if (process.env.NODE_ENV === 'development') routes.use('/bull-dashboard', UI);

routes.post('/sessions', ValidatorMiddleware(Login), SessionController.store);

routes.use(AuthMiddleware);

routes.get('/me', MeController.index);

routes.get('/recipients/:id', RecipientController.show);
routes.get(
  '/recipients',
  WhereMiddleware(
    { op: Op.iLike, name: 'name', transform: transformLikeable },
    { op: Op.iLike, name: 'city', transform: transformLikeable },
    { op: Op.iLike, name: 'state', transform: transformLikeable },
    { op: Op.iLike, name: 'cep', transform: transformLikeable }
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
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.get(
  '/deliverymen',
  WhereMiddleware(
    { op: Op.iLike, name: 'name', transform: transformLikeable },
    { op: Op.iLike, name: 'email', transform: transformLikeable }
  ),
  DeliverymanController.index
);
routes.put(
  '/deliverymen/:id',
  MulterMiddleware('avatar'),
  DeliverymanController.update
);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);

routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);

export default routes;
