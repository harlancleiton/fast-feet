import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';
import generateJwt from '../util/generateJwt';

describe('Me', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return the logged in user at the time of request', async () => {
    const user = await factory.create('User', { password: 'admin' });
    const token = await generateJwt(user, 'admin');

    const response = await request(app)
      .get('/api/v1/me')
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(user.id);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.name).toEqual(user.name);
  });

  it('should return an unauthorization error', async () => {
    const response = await request(app)
      .get('/api/v1/me')
      .set('Authorization', `Bearer fake-token`)
      .send();

    expect(response.status).toEqual(401);
    expect(response.body.id).toBeUndefined();
  });
});
