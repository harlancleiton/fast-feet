import { resolve } from 'path';
import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import jwtService from '../../src/app/services/JwtService';
import truncate from '../util/truncate';

describe('Deliveryman', () => {
  let token;

  beforeEach(async () => {
    await truncate();

    const user = await factory.create('User', { password: 'admin' });
    token = (await jwtService.login(user.email, 'admin')).token;
  });

  it('should be return a new deliveryman', async () => {
    const deliveryman = await factory.build('Deliveryman', {
      active: false,
      shutdownDate: null,
    });

    const response = await request(app)
      .post('/api/v1/deliverymen')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', resolve(__dirname, '..', 'avatar-test.png'))
      .field('name', deliveryman.name)
      .field('email', deliveryman.email);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.avatar).toHaveProperty('url');
    expect(response.body.name).toBe(deliveryman.name);
    expect(response.body.email).toBe(deliveryman.email);
  });
});
