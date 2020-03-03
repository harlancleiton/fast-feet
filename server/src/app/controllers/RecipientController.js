import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const { name, street, number, complement, city, state, cep } = req.body;

    const recipient = await Recipient.create({
      name,
      street,
      number,
      complement,
      city,
      state,
      cep,
    });

    return res.status(201).json(recipient);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) return res.status(404).json();

    return res.json(recipient);
  }

  async index(req, res) {
    const { offset, limit } = req.pagination;
    const { where } = req;

    const recipients = await Recipient.findAndCountAll({
      where: where || undefined,
      offset,
      limit,
    });

    return res.json({
      ...recipients,
      paginate: { page: req.pagination.page, limit: req.pagination.limit },
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) return res.status(404).json();

    const { name, street, number, complement, city, state, cep } = req.body;

    recipient.setAttributes({
      name,
      street,
      number,
      complement,
      city,
      state,
      cep,
    });

    await recipient.save();

    return res.status(204).json();
  }

  async destroy(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) return res.status(404).json();

    await recipient.destroy({ force: true });

    return res.status(204).json();
  }
}

export default new RecipientController();
