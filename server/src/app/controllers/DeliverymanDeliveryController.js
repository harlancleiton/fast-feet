import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class DeliverymanDeliveryController {
  async index(req, res) {
    const { deliverymanId } = req.params;
    const { status = 'pending' } = req.query;
    const { offset, limit } = req.pagination;

    const getWhere = () => {
      switch (status) {
        case 'pending':
          return {
            endDate: null,
            canceledAt: null,
          };
        case 'delivered':
          return {
            startDate: { [Op.ne]: null },
            endDate: { [Op.ne]: null },
            canceledAt: null,
          };
        case 'canceled':
          return {
            startDate: { [Op.ne]: null },
            endDate: null,
            canceledAt: { [Op.ne]: null },
          };
        default:
          return {};
      }
    };

    const deliveries = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        ...getWhere(),
      },
      offset,
      limit,
    });

    const result = Object.assign(deliveries, {
      paginate: { page: req.pagination.page, limit: req.pagination.limit },
    });

    return res.json(result);
  }
}

export default new DeliverymanDeliveryController();
