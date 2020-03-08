import factory from '../factory';
import jwtService from '../../src/app/services/JwtService';

export default async function(user, password) {
  const userLogin =
    user || (await factory.create('User', { password: 'admin' }));

  const { token } = await jwtService.login(
    userLogin.email,
    user ? password : 'admin'
  );

  return token;
}
