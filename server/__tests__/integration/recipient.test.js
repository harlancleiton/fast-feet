import request from 'supertest';
import factory from '../factory';

import app from '../../src/app';
import truncate from '../util/truncate';
import generateJwt from '../util/generateJwt';
import Recipient from '../../src/app/models/Recipient';

describe('Recipient', () => {
  let token;

  beforeEach(async () => {
    await truncate();

    token = await generateJwt();
  });

  it('should be return a new recipient', async () => {
    const recipient = await factory.build('Recipient');

    const response = await request(app)
      .post('/api/v1/recipients')
      .auth(token, { type: 'bearer' })
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

  it('should return a recipient', async () => {
    const recipient = await factory.create('Recipient');

    const response = await request(app)
      .get(`/api/v1/recipients/${recipient.id}`)
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(recipient.id);
  });

  it('should return a recipients pagination', async () => {
    const recipient = await factory.create('Recipient');

    const response = await request(app)
      .get('/api/v1/recipients')
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.paginate).toBeDefined();
    expect(response.body.rows[0].id).toEqual(recipient.id);
  });

  it('should return http code 204 after update the recipient', async () => {
    const recipient = await factory.create('Recipient');

    const response = await request(app)
      .put(`/api/v1/recipients/${recipient.id}`)
      .auth(token, { type: 'bearer' })
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
    const response = await request(app)
      .put('/api/v1/recipients/id')
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(404);
  });

  it('should return the http 204 code when delete recipient', async () => {
    const recipient = await factory.create('Recipient');

    const response = await request(app)
      .delete(`/api/v1/recipients/${recipient.id}`)
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toEqual(204);

    const checkRecipient = await Recipient.findByPk(recipient.id);
    expect(checkRecipient).toBeNull();
  });
});
