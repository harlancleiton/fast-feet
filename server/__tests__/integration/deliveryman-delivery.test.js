import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';

describe('Deliveryman/Delivery', () => {
  const path = (id, resource = 'deliverymen') =>
    id ? `/api/v1/${resource}/${id}` : `/api/v1/${resource}`;

  beforeEach(async () => {
    await truncate();
  });

  it('should list pending deliveries from a specific delivery person', async () => {
    const deliveryman = await factory.create('Deliveryman');
    await factory.create('Delivery', {
      canceledAt: new Date(),
      starDate: new Date(),
      deliveryman_id: deliveryman.id,
    });
    const delivery = await factory.create('Delivery', {
      starDate: new Date(),
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      startDate: new Date(),
      endDate: new Date(),
      deliveryman_id: deliveryman.id,
    });

    const response = await request(app).get(
      `${path(deliveryman.id, 'deliveryman')}/deliveries`
    );

    expect(response.status).toBe(200);
    expect(response.body.rows.length).toBe(1);

    const expected = delivery.toJSON();
    delete expected.updatedAt;
    delete expected.createdAt;

    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows).toContainEqual(
      expect.objectContaining(expected)
    );
  });

  it('should list completed deliveries from a specific deliveryman', async () => {
    const deliveryman = await factory.create('Deliveryman');
    await factory.create('Delivery', {
      canceledAt: new Date(),
      starDate: new Date(),
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      starDate: new Date(),
      deliveryman_id: deliveryman.id,
    });
    const delivery = await factory.create('Delivery', {
      startDate: new Date(),
      endDate: new Date(),
      deliveryman_id: deliveryman.id,
    });

    const response = await request(app)
      .get(`${path(deliveryman.id, 'deliveryman')}/deliveries`)
      .query({ status: 'delivered' });

    expect(response.status).toBe(200);
    expect(response.body.rows.length).toBe(1);

    const expected = delivery.toJSON();
    delete expected.updatedAt;
    delete expected.createdAt;
    delete expected.startDate;
    delete expected.endDate;

    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows).toContainEqual(
      expect.objectContaining(expected)
    );
    expect(response.body.rows[0].startDate).toBeDefined();
    expect(response.body.rows[0].endDate).toBeDefined();
  });

  it('should list canceled deliveries from a specific deliveryman', async () => {
    const deliveryman = await factory.create('Deliveryman');
    const delivery = await factory.create('Delivery', {
      startDate: new Date(),
      canceledAt: new Date(),
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      startDate: new Date(),
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      startDate: new Date(),
      endDate: new Date(),
      deliveryman_id: deliveryman.id,
    });

    const response = await request(app)
      .get(`${path(deliveryman.id, 'deliveryman')}/deliveries`)
      .query({ status: 'canceled' });

    expect(response.status).toBe(200);
    expect(response.body.rows.length).toBe(1);

    const expected = delivery.toJSON();
    delete expected.updatedAt;
    delete expected.createdAt;
    delete expected.startDate;
    delete expected.canceledAt;

    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows).toContainEqual(
      expect.objectContaining(expected)
    );
    expect(response.body.rows[0]).toHaveProperty('startDate');
    expect(response.body.rows[0]).toHaveProperty('endDate');
  });
});
