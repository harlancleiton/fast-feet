import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
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
      .set('Authorization', `Bearer ${token}`)
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

  it('should return http code 204 after update the delivery', async () => {
    const delivery = await factory.create('Delivery');

    const response = await request(app)
      .put(path(delivery.id))
      .set('Authorization', `Bearer ${token}`)
      .send({ product: 'Lorem Ipsum' });

    await delivery.reload();

    expect(response.status).toEqual(204);
    expect(delivery.product).toEqual('Lorem Ipsum');
  });

  it('should return the http 404 code when updating a non-existent delivery', async () => {
    const response = await request(app)
      .put(path(10000))
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toEqual(404);
  });
});
