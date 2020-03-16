import '../src/bootstrap';

import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Recipient from '../src/app/models/Recipient';
import Deliveryman from '../src/app/models/Deliveryman';
import S3File from '../src/app/models/S3File';
import Delivery from '../src/app/models/Delivery';
import DeliveryProblem from '../src/app/models/DeliveryProblem';

factory.define('User', User, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

factory.define('Recipient', Recipient, () => ({
  name: faker.name.findName(),
  street: faker.address.streetName(),
  number: faker.random.number({ max: 1000, min: 1 }),
  complement: faker.address.secondaryAddress(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  cep: faker.address.zipCode(),
}));

factory.define('Deliveryman', Deliveryman, () => {
  const active = faker.random.boolean();

  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    shutdownDate: active ? null : faker.date.recent(),
    active,
  };
});

factory.define('S3File', S3File, () => ({
  key: faker.system.commonFileName(),
  name: faker.system.fileName(),
}));

factory.define(
  'Delivery',
  Delivery,
  () => ({
    product: faker.commerce.productName(),
  }),
  {
    afterBuild: async (model, attrs) => {
      const delivery = model;

      if (!attrs.recipient_id) {
        const recipient = await factory.create('Recipient');
        delivery.recipient_id = recipient.id;
      }

      if (!attrs.deliveryman_id) {
        const deliveryman = await factory.create('Deliveryman');
        delivery.deliveryman_id = deliveryman.id;
      }

      return delivery;
    },
  }
);

factory.define(
  'DeliveryProblem',
  DeliveryProblem,
  () => ({
    description: faker.lorem.paragraph(),
  }),
  {
    afterBuild: async (model, attrs) => {
      const deliveryProblem = model;

      if (!attrs.delivery_id) {
        const delivery = await factory.create('Delivery');
        deliveryProblem.delivery_id = delivery.id;
      }

      return deliveryProblem;
    },
  }
);

export default factory;
