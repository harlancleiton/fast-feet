import Deliveryman from '../models/Deliveryman';
import S3File from '../models/S3File';

class DeliverymanController {
  async store(req, res) {
    let s3file;
    if (req.file) {
      const { originalname, filename, key } = req.file;
      s3file = await S3File.create({
        name: originalname,
        key: key || filename,
      });
    }

    const { name, email } = req.body;
    const deliveryman = await Deliveryman.create({
      name,
      email,
      avatar_id: s3file ? s3file.id : null,
    });

    res.status(201).json({ ...deliveryman.toJSON(), avatar_url: s3file.url });
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);
    const avatar = await deliveryman.getAvatar();

    return res.json({
      ...deliveryman.toJSON(),
      avatar_url: avatar ? avatar.url : null,
    });
  }

  async index(req, res) {
    const {
      where,
      pagination: { offset, limit },
    } = req;

    const deliverymen = await Deliveryman.findAndCountAll({
      where: where || undefined,
      offset,
      limit,
    });

    const deliverymenWithAvatars = Object.assign(
      deliverymen,
      {
        rows: await Promise.all(
          Object.keys(deliverymen.rows).map(async key => {
            const avatar = await S3File.findByPk(
              deliverymen.rows[key].avatar_id
            );

            return Object.assign(deliverymen.rows[key].toJSON(), {
              avatar_url: avatar ? avatar.url : null,
            });
          })
        ),
      },
      { paginate: { page: req.pagination.page, limit: req.pagination.limit } }
    );

    return res.json(deliverymenWithAvatars);
  }

  async update(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) return res.status(404).json();

    if (req.file) {
      const avatar = await deliveryman.getAvatar();
      if (avatar) await avatar.destroy();

      const { originalname, filename, key } = req.file;
      const s3file = await S3File.create({
        name: originalname,
        key: key || filename,
      });

      deliveryman.setAttributes({ avatar_id: s3file.id });
    }

    const { name, email } = req.body;

    deliveryman.setAttributes({ name, email });

    await deliveryman.save();

    return res.status(204).json();
  }

  async destroy(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) return res.status(404).json();

    await deliveryman.destroy({ force: true });

    return res.status(204).json();
  }
}

export default new DeliverymanController();
