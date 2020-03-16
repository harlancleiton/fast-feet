import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async index(req, res) {
    const { deliveryId } = req.params;

    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryId },
    });

    if (problems.length) return res.json(problems);

    return res.status(404).json();
  }

  async store(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) return res.status(404).json();

    const { description } = req.body;

    const problem = await DeliveryProblem.create({
      delivery_id: delivery.id,
      description,
    });

    return res.status(201).json(problem);
  }
}

export default new DeliveryProblemsController();
