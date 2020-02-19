import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be return jwt token', async () => {
    const user = await factory.create('User', { password: 'admin' });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: user.email, password: 'admin' });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  it('should return an unauthorization error', async () => {
    const user = await factory.create('User', { password: 'admin' });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: user.email, password: 'admin2' });

    expect(response.status).toEqual(401);
    expect(response.body.id).toBeUndefined();
  });

  it('should be return an validation error', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'email' });

    expect(response.status).toEqual(400);
    expect(response.body.name).toEqual('ValidationError');
    expect(response.body.errors.length).toEqual(2);
    expect(response.body.inner.length).toEqual(2);
  });
});
