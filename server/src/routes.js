import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import MeController from './app/controllers/MeController';
import RecipientController from './app/controllers/RecipientController';
import ValidatorMiddleware from './app/middlewares/ValidatorMiddleware';
import Login from './app/validators/Login';

const routes = new Router();

routes.post('/sessions', ValidatorMiddleware(Login), SessionController.store);

routes.use(AuthMiddleware);

routes.get('/me', MeController.index);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
