import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import jwtService from '../../src/app/services/JwtService';
import truncate from '../util/truncate';

describe('Me', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return the logged in user at the time of request', async () => {
    const user = await factory.create('User', { password: 'admin' });
    const { token } = await jwtService.login(user.email, 'admin');

    const response = await request(app)
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(user.id);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.name).toEqual(user.name);
  });

  it('should return an unauthorization error', async () => {
    const response = await request(app)
      .get('/api/v1/me')
      .set('Authorization', `Bearer fake-token`);

    expect(response.status).toEqual(401);
    expect(response.body.id).toBeUndefined();
  });
});
