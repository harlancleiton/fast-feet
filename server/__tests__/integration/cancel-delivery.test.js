import request from 'supertest';
import { isSameDay } from 'date-fns';

import app from '../../src/app';
import factory from '../factory';
import generateJwt from '../util/generateJwt';
import truncate from '../util/truncate';
import Queue from '../../src/lib/Queue';
import { SendMail } from '../../src/app/jobs';

describe('Cancel Delivery', () => {
  let token;

  const path = id => `/api/v1/problem/${id}/cancel-delivery`;

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should cancel a delivery from an problem', async () => {
    const deliveryman = await factory.create('Deliveryman', {
      active: true,
      shutdownDate: null,
    });
    const delivery = await factory.create('Delivery', {
      deliveryman_id: deliveryman.id,
    });
    const problem = await factory.create('DeliveryProblem', {
      delivery_id: delivery.id,
    });

    jest.spyOn(Queue, 'add').mockImplementation(() => {});

    const response = await request(app)
      .delete(path(problem.id))
      .auth(token, { type: 'bearer' });

    expect(Queue.add).toHaveBeenCalledWith(
      SendMail.key,
      expect.objectContaining({
        template: 'cancel-delivery',
        user: expect.objectContaining(deliveryman.toJSON()),
      })
    );

    expect(response.status).toBe(204);

    await delivery.reload();

    expect(isSameDay(new Date(), delivery.canceledAt)).toBeTruthy();
  });

  it('should avoid canceling an already canceled delivery', async () => {
    const delivery = await factory.create('Delivery', {
      canceledAt: new Date(),
    });
    const problem = await factory.create('DeliveryProblem', {
      delivery_id: delivery.id,
    });

    const response = await request(app)
      .delete(path(problem.id))
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
