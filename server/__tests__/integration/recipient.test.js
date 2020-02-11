import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import jwtService from '../../src/app/services/JwtService';
import truncate from '../util/truncate';

describe('Recipient', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be return a new recipient', async () => {
    const user = await factory.create('User', { password: 'admin' });
    const { token } = await jwtService.login(user.email, 'admin');

    const recipient = await factory.build('Recipient');

    const response = await request(app)
      .post('/api/v1/recipients')
      .set('Authorization', `Bearer ${token}`)
      .send(recipient.dataValues);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(recipient.name);
    expect(response.body.street).toEqual(recipient.street);
    expect(response.body.number).toEqual(recipient.number);
    expect(response.body.complement).toEqual(recipient.complement);
    expect(response.body.state).toEqual(recipient.state);
    expect(response.body.city).toEqual(recipient.city);
    expect(response.body.cep).toEqual(recipient.cep);
  });
});
