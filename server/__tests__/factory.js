import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Recipient from '../src/app/models/Recipient';
import Deliveryman from '../src/app/models/Deliveryman';

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

export default factory;
