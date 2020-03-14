import { resolve } from 'path';
import request from 'supertest';
import { setMilliseconds, setSeconds, isEqual } from 'date-fns';

import app from '../../src/app';
import factory from '../factory';
import truncate from '../util/truncate';

describe('End Delivery', () => {
  const path = (id, resource = 'delivery') => `/api/v1/${resource}/${id}/end`;

  beforeEach(async () => {
    await truncate();
  });

  it('should end delivery', async () => {
    const delivery = await factory.create('Delivery', {
      startDate: new Date(),
    });

    const response = await request(app)
      .put(`${path(delivery.id)}`)
      .attach('signature', resolve(__dirname, '..', 'avatar-test.png'));

    expect(response.status).toBe(204);

    await delivery.reload();
    const signature = await delivery.getSignature();

    expect(signature).not.toBeNull();
    expect(delivery.startDate).toBeDefined();
    expect(delivery.endDate).toBeDefined();
    expect(delivery.canceledAt).toBeNull();

    const now = setSeconds(setMilliseconds(new Date(), 0), 0);
    const endDate = setSeconds(setMilliseconds(delivery.endDate, 0), 0);
    expect(isEqual(now, endDate)).toBe(true);
  });

  it('should prevent the deliveryman from completing a canceled order', async () => {
    const delivery = await factory.create('Delivery', {
      startDate: new Date(),
      canceledAt: new Date(),
    });

    const response = await request(app)
      .put(`${path(delivery.id)}`)
      .attach('signature', resolve(__dirname, '..', 'avatar-test.png'));

    expect(response.status).toBe(400);

    await delivery.reload();
    const signature = await delivery.getSignature();

    expect(signature).toBeNull();
    expect(delivery.startDate).toBeDefined();
    expect(delivery.endDate).toBeNull();
    expect(delivery.canceledAt).toBeDefined();
  });
});
