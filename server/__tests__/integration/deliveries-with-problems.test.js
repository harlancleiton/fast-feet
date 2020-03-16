import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';
import generateJwt from '../util/generateJwt';

describe('Delivery Problem', () => {
  let token;

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should return a pagination of deliveries with problems', async () => {
    const delivery = await factory.create('Delivery');
    await factory.createMany('Delivery', 4);

    await factory.createMany('DeliveryProblem', 2, {
      delivery_id: delivery.id,
    });

    const response = await request(app)
      .get('/api/v1/deliveries-with-problems')
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows.length).toEqual(1);
  });
});
