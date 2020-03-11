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

  async index(req, res) {
    const {
      where,
      pagination: { offset, limit },
    } = req;

    const deliveries = await Delivery.findAndCountAll({
      where: where || undefined,
      offset,
      limit,
    });

    const result = Object.assign(deliveries, {
      paginate: { page: req.pagination.page, limit: req.pagination.limit },
    });

    return res.json(result);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) return res.status(404).json();

    return res.json(delivery);
  }

  async update(req, res) {
    const { id } = req.params;
    const { product } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) return res.status(404).json();

    delivery.setAttributes({ product });

    await delivery.save();

    return res.status(204).json();
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) return res.status(404).json();

    delivery.setAttributes({ canceledAt: new Date() });
    await delivery.save();

    return res.status(204).json();
  }
}

export default new DeliveryController();
