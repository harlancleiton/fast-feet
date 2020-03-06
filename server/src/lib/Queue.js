import Queue from 'bull';
import { setQueues } from 'bull-board';
import * as Sentry from '@sentry/node';

import redisConfig from '../config/redis';
import sentryConfig from '../config/sentry';
import * as jobs from '../app/jobs';

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

setQueues(queues.map(queue => queue.bull));

Sentry.init({ dns: sentryConfig.dsn });

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find(q => q.name === name);

    return queue.bull.add(data, queue.options);
  },

  process() {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        Sentry.configureScope(scope => {
          scope.setExtra(job);
        });

        Sentry.captureException(err);
      });
    });
  },
};
