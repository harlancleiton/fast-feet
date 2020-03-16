import factory from '../factory';

import truncate from '../util/truncate';
import Mail from '../../src/lib/Mail';
import { SendMail } from '../../src/app/jobs';

describe('Send Mail', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should send mail', async () => {
    const deliveryman = await factory.create('Deliveryman');
    const delivery = await factory.create('Delivery', {
      deliveryman_id: deliveryman.id,
    });

    jest.spyOn(Mail, 'sendMail').mockImplementation(() => {});

    await SendMail.handle({
      data: {
        user: deliveryman.toJSON(),
        subject: 'Nova entrega',
        template: 'new-delivery',
        data: { delivery: delivery.toJSON() },
      },
    });

    expect(Mail.sendMail).toHaveBeenCalled();
  });
});
