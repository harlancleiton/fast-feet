import Delivery from '../models/Delivery';
import Queue from '../../lib/Queue';
import { SendMail } from '../jobs';

class DeliveryController {
  async store(req, res) {
    const { product, recipient_id, deliveryman_id } = req.body;

    const delivery = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    const deliveryman = await delivery.getDeliveryman();

    Queue.add(SendMail.key, {
      user: deliveryman.toJSON(),
      subject: 'Nova entrega',
      template: 'new-delivery',
      data: { delivery: delivery.toJSON() },
    });

    return res.status(201).json(delivery);
  }
}

export default new DeliveryController();
