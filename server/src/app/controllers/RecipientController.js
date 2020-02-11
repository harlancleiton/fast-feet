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
}

export default new RecipientController();
