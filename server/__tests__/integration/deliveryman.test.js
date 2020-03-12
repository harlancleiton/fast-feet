import { resolve } from 'path';
import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';
import generateJwt from '../util/generateJwt';
import Deliveryman from '../../src/app/models/Deliveryman';

describe('Deliveryman', () => {
  let token;

  const path = id => (id ? `/api/v1/deliverymen/${id}` : '/api/v1/deliverymen');

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should be return a new deliveryman', async () => {
    const deliveryman = await factory.build('Deliveryman', {
      active: false,
      shutdownDate: null,
    });

    const response = await request(app)
      .post(path())
      .auth(token, { type: 'bearer' })
      .attach('avatar', resolve(__dirname, '..', 'avatar-test.png'))
      .field('name', deliveryman.name)
      .field('email', deliveryman.email);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(deliveryman.name);
    expect(response.body.email).toBe(deliveryman.email);
    expect(response.body).toHaveProperty('avatar_url');
  });

  it('should return a deliveryman', async () => {
    const s3File = await factory.create('S3File');
    const deliveryman = await factory.create('Deliveryman', {
      avatar_id: s3File.id,
    });

    const response = await request(app)
      .get(path(deliveryman.id))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(deliveryman.id);
    expect(response.body.name).toBe(deliveryman.name);
    expect(response.body.email).toBe(deliveryman.email);
    expect(response.body).toHaveProperty('avatar_url');
  });

  it('should return a deliverymen pagination', async () => {
    const s3File = await factory.create('S3File');
    const deliveryman = await factory.create('Deliveryman', {
      avatar_id: s3File.id,
    });

    await factory.create('Deliveryman');

    const response = await request(app)
      .get(path())
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows[0].id).toEqual(deliveryman.id);
    expect(response.body.rows[0]).toHaveProperty('avatar_url');
    expect(response.body.rows[1].avatar_url).toBeNull();
  });

  it('should return http code 204 after update the deliveryman', async () => {
    const s3File = await factory.create('S3File');
    const deliveryman = await factory.create('Deliveryman', {
      avatar_id: s3File.id,
    });

    const response = await request(app)
      .put(`/api/v1/deliverymen/${deliveryman.id}`)
      .auth(token, { type: 'bearer' })
      .attach('avatar', resolve(__dirname, '..', 'avatar-test.png'))
      .field('name', 'Harlan Cleiton')
      .field('email', 'harlancleiton@gmail.com');

    await deliveryman.reload();

    expect(response.status).toEqual(204);
    expect(deliveryman.name).toEqual('Harlan Cleiton');
    expect(deliveryman.email).toEqual('harlancleiton@gmail.com');

    const avatar = await deliveryman.getAvatar();
    expect(avatar.url).not.toBe(s3File.url);
  });

  it('should return the http 404 code when updating a non-existent deliveryman', async () => {
    const response = await request(app)
      .put(path(10000))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(404);
  });

  it('should return the http 204 code when delete deliveryman', async () => {
    const deliveryman = await factory.create('Deliveryman');

    const response = await request(app)
      .delete(path(deliveryman.id))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(204);

    const checkDeliveryman = await Deliveryman.findByPk(deliveryman.id);
    expect(checkDeliveryman).toBeNull();
  });

  it('should return the http 404 code when deleting a non-existent deliveryman', async () => {
    const response = await request(app)
      .delete(path(10000))
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(404);
  });
});
