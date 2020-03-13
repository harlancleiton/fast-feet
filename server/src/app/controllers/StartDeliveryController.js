import { Op } from 'sequelize';
import { startOfDay } from 'date-fns';

import Delivery from '../models/Delivery';

class StartDeliveryController {
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) return res.status(404).json();

    const deliveryman = await delivery.getDeliveryman();

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        startDate: { [Op.gte]: startOfDay(new Date()) },
      },
    });

    if (deliveries.length >= 5)
      return res.status(400).json({
        error: 'Can only be withdrawn up to five deliveries per day',
      });

    delivery.setAttributes({ startDate: new Date() });

    await delivery.save();

    return res.status(204).json();
  }
}

export default new StartDeliveryController();
