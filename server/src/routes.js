import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import MeController from './app/controllers/MeController';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware.handle);

routes.get('/me', MeController.index);

routes.post('/recipients', RecipientController.store);

export default routes;
