import './bootstrap';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import sentryConfig from './config/sentry';
import routes from './routes';
import PaginateMiddleware from './app/middlewares/PaginateMiddleware';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    Sentry.init({ dns: sentryConfig.dsn });
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(express.json());

    if (process.env.NODE_ENV !== 'test') this.server.use(morgan('dev'));

    this.server.use(PaginateMiddleware);
  }

  routes() {
    this.server.use(cors({ origin: '*' }));

    this.server.use('/api/v1', routes);

    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      res.status(500).json(errors);

      return next();
    });
  }
}

export default new App().server;
