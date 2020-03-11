import request from 'supertest';
import { isSameDay } from 'date-fns';

import app from '../../src/app';
import factory from '../factory';
import generateJwt from '../util/generateJwt';
import truncate from '../util/truncate';
import Queue from '../../src/lib/Queue';
import { SendMail } from '../../src/app/jobs';

describe('Delivery', () => {
  let token;

  const path = id => (id ? `/api/v1/deliveries/${id}` : '/api/v1/deliveries');

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should be return a new delivery', async () => {
    const deliveryman = await factory.create('Deliveryman');
    const recipient = await factory.create('Recipient');

    const delivery = await factory.build('Delivery', {
      deliveryman_id: deliveryman.id,
      recipient_id: recipient.id,
    });

    jest.spyOn(Queue, 'add').mockImplementation(() => {});

    const response = await request(app)
      .post(path())
      .auth(token, { type: 'bearer' })
      .send(delivery.toJSON());

    expect(Queue.add).toHaveBeenCalledWith(
      SendMail.key,
      expect.objectContaining({
        template: 'new-delivery',
        user: expect.objectContaining(deliveryman.toJSON()),
      })
    );

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.recipient_id).toBe(recipient.id);
    expect(response.body.deliveryman_id).toBe(deliveryman.id);
  });

  it('should return a delivery pagination', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app)
      .get(path())
      .auth(token, { type: 'bearer' })
      .query({ product: delivery.product.substring(1, 3) })
      .send();

    const expected = delivery.toJSON();
    delete expected.updatedAt;
    delete expected.createdAt;

    expect(response.status).toEqual(200);
    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows).toContainEqual(
      expect.objectContaining(expected)
    );
  });

  it('should return http code 204 after update the delivery', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app)
      .put(path(delivery.id))
      .auth(token, { type: 'bearer' })
      .send({ product: 'Lorem Ipsum' });

    await delivery.reload();

    expect(response.status).toEqual(204);
    expect(delivery.product).toEqual('Lorem Ipsum');
  });

  it('should return the http 404 code when updating a non-existent delivery', async () => {
    const response = await request(app)
      .put(path(10000))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(404);
  });

  it('should return a delivery', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app)
      .get(path(delivery.id))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(delivery.id);
    expect(response.body.recipient_id).toBe(delivery.recipient_id);
    expect(response.body.deliveryman_id).toBe(delivery.deliveryman_id);
    expect(response.body.product).toBe(delivery.product);
  });

  it('should return the http 204 code when delete delivery', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app)
      .delete(path(delivery.id))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(204);

    await delivery.reload();

    expect(isSameDay(new Date(), delivery.canceledAt)).toBe(true);
  });

  it('should return the http 404 code when deleting a non-existent deliveryman', async () => {
    const response = await request(app)
      .delete(path(10000))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(404);
  });
});
