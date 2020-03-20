import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import theme from '../../styles/theme';
import Logo from '../Logo';
import { Container, Divider, Content, Profile } from './styles';
import { signOut } from '../../store/modules/auth/actions';

export default function Header() {
  const dispatch = useDispatch();

  const { profile } = useSelector(store => store.user);

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <NavLink to="/">
            <Logo width={135} height={26} />
          </NavLink>
          <Divider />
          <NavLink activeStyle={{ color: theme.colors.black }} to="/deliveries">
            Encomendas
          </NavLink>
          <NavLink
            activeStyle={{ color: theme.colors.black }}
            to="/deliverymen"
          >
            Entregadores
          </NavLink>
          <NavLink activeStyle={{ color: theme.colors.black }} to="/recipients">
            Destinatários
          </NavLink>
        </nav>

        <aside>
          <Profile>
            <strong>{profile.name}</strong>
            <NavLink to="/" onClick={handleSignOut}>
              Sair do sistema
            </NavLink>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
