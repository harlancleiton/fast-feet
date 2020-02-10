import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import MeController from './app/controllers/MeController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware.handle);

routes.get('/me', MeController.index);

export default routes;
