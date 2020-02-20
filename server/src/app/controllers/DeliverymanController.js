import S3File from '../models/S3File';

class DeliverymanController {
  async store(req, res) {
    const { originalname: name, filename, key } = req.file;

    // eslint-disable-next-line no-unused-vars
    const s3file = await S3File.create({ name, key: key || filename });

    res.status(204).json();
  }
}

export default new DeliverymanController();
