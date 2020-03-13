import request from 'supertest';
import { setMilliseconds, setSeconds, isEqual } from 'date-fns';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('Start Delivery', () => {
  const path = (id, resource = 'delivery') => `/api/v1/${resource}/${id}/start`;

  beforeEach(async () => {
    await truncate();
  });

  it('should start delivery', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app).put(`${path(delivery.id)}`);

    expect(response.status).toBe(204);

    await delivery.reload();

    expect(delivery.startDate).toBeDefined();
    expect(delivery.endDate).toBeNull();
    expect(delivery.canceledAt).toBeNull();

    const now = setSeconds(setMilliseconds(new Date(), 0), 0);
    const startDate = setSeconds(setMilliseconds(delivery.startDate, 0), 0);
    expect(isEqual(now, startDate)).toBe(true);
  });

  it('should prevent the deliveryman from making more than five withdrawals a day', async () => {
    const deliveryman = await factory.create('Deliveryman');
    await factory.createMany('Delivery', 5, {
      deliveryman_id: deliveryman.id,
      startDate: new Date(),
    });

    const delivery = await factory.create('Delivery', {
      deliveryman_id: deliveryman.id,
    });

    const response = await request(app).put(`${path(delivery.id)}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');

    await delivery.reload();

    expect(delivery.startDate).toBeNull();
    expect(delivery.endDate).toBeNull();
    expect(delivery.canceledAt).toBeNull();
  });
});
