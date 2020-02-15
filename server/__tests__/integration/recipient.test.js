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

  it('should return http code 204 after update the recipient', async () => {
    const user = await factory.create('User', { password: 'admin' });
    const { token } = await jwtService.login(user.email, 'admin');

    const recipient = await factory.create('Recipient');

    const response = await request(app)
      .put(`/api/v1/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Harlan Cleiton',
        street: 'Lorem Ipsum',
        number: 123,
        complement: 'Complement',
        state: 'BA',
        city: 'Salvador',
        cep: '40000000',
      });

    await recipient.reload();

    expect(response.status).toEqual(204);
    expect(recipient.name).toEqual('Harlan Cleiton');
    expect(recipient.street).toEqual('Lorem Ipsum');
    expect(recipient.number).toEqual(123);
    expect(recipient.complement).toEqual('Complement');
    expect(recipient.state).toEqual('BA');
    expect(recipient.city).toEqual('Salvador');
    expect(recipient.cep).toEqual('40000000');
  });

  it('should return the http 404 code when updating a non-existent recipient', async () => {
    const user = await factory.create('User', { password: 'admin' });
    const { token } = await jwtService.login(user.email, 'admin');

    const response = await request(app)
      .put('/api/v1/recipients/id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(404);
  });
});
