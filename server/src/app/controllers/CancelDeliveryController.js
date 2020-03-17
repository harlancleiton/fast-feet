import DeliveryProblem from '../models/DeliveryProblem';
import Queue from '../../lib/Queue';
import { SendMail } from '../jobs';
import mailConfig from '../../config/mail';

class CancelDeliveryController {
  async delete(req, res) {
    const { problemId } = req.params;

    const problem = await DeliveryProblem.findByPk(problemId);

    if (!problem) return res.status(404).json();

    const delivery = await problem.getDelivery();

    if (delivery.canceledAt)
      return res
        .status(400)
        .json({ error: 'This delivery is already canceled' });

    delivery.setAttributes({ canceledAt: new Date() });
    await delivery.save();

    const deliveryman = await delivery.getDeliveryman();

    Queue.add(SendMail.key, {
      user: deliveryman.toJSON(),
      subject: 'Entrega cancelada',
      template: 'cancel-delivery',
      data: {
        delivery: delivery.toJSON(),
        contactMail: mailConfig.default.contactMail,
      },
    });

    return res.status(204).json();
  }
}

export default new CancelDeliveryController();
