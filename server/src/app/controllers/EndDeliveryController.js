import S3File from '../models/S3File';
import Delivery from '../models/Delivery';

class EndDeliveryController {
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) return res.status(404).json();

    if (delivery.canceledAt)
      return res.status(400).json({ erorr: 'This delivery has been canceled' });

    const { originalname, filename, key } = req.file;
    const signature = await S3File.create({
      name: originalname,
      key: key || filename,
    });

    delivery.setAttributes({ endDate: new Date(), signature_id: signature.id });
    await delivery.save();

    return res.status(204).json();
  }
}

export default new EndDeliveryController();
