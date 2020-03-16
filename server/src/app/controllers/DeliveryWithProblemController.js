import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveriesWithProblemsController {
  async index(req, res) {
    const { offset, limit } = req.pagination;

    const deliveries = await Delivery.findAndCountAll({
      include: [
        { model: DeliveryProblem, required: true, as: 'deliveryProblem' },
      ],
      offset,
      limit,
    });

    return res.json({
      ...deliveries,
      paginate: { page: req.pagination.page, limit: req.pagination.limit },
    });
  }
}

export default new DeliveriesWithProblemsController();
