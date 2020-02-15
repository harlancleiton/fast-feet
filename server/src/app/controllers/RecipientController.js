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
}

export default new RecipientController();
