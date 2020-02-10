import User from '../models/User';

class MeController {
  async index(req, res) {
    const { id } = req.auth;
    const user = await User.findByPk(id);

    const { name, email } = user;

    return res.json({ id, name, email });
  }
}

export default new MeController();
