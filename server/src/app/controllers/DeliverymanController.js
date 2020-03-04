import Deliveryman from '../models/Deliveryman';
import S3File from '../models/S3File';

class DeliverymanController {
  async store(req, res) {
    const { originalname, filename, key } = req.file;
    const s3file = await S3File.create({
      name: originalname,
      key: key || filename,
    });

    const { name, email } = req.body;
    const deliveryman = await Deliveryman.create({
      name,
      email,
      avatar_id: s3file.id,
    });

    res.status(201).json({
      ...deliveryman.toJSON(),
      avatar: { id: s3file.id, url: s3file.url, createdAt: s3file.createdAt },
    });
  }
}

export default new DeliverymanController();
