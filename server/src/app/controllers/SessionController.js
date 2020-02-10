import jwtService from '../services/JwtService';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const result = await jwtService.login(email, password);

    if (!result) return res.status(401).json();

    const { user, token } = result;

    return res.json({ user, token });
  }
}

export default new SessionController();
