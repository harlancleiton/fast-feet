import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';
import generateJwt from '../util/generateJwt';

describe('Delivery Problems', () => {
  let token;

  const path = id => `/api/v1/delivery/${id}/problems`;

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should return the problems of a delivery', async () => {
    const delivery = await factory.create('Delivery');

    await factory.createMany('DeliveryProblem', 2, {
      delivery_id: delivery.id,
    });

    const response = await request(app)
      .get(path(delivery.id))
      .auth(token, { type: 'bearer' });

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ delivery_id: delivery.id }),
      ])
    );
  });

  it('should register a new problem for a delivery', async () => {
    const delivery = await factory.create('Delivery');
    const problem = await factory.build('DeliveryProblem');

    const response = await request(app)
      .post(path(delivery.id))
      .send({ description: problem.description });

    expect(response.status).toEqual(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.description).toEqual(problem.description);

    const problems = await delivery.getDeliveryProblems();

    expect(problems.length).toEqual(1);
    expect(problems[0].id).toEqual(response.body.id);
  });
});
