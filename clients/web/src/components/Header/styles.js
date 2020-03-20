import styled from 'styled-components';

export const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    align-items: center;

    a {
      font: ${props => props.theme.fonts.navLink};
      color: ${props => props.theme.colors.gray2};
      text-transform: uppercase;

      & + a {
        margin-left: 20px;
      }
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 32px;
  background: ${props => props.theme.colors.gray};

  margin: 0px 30px;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  strong {
    font: ${props => props.theme.fonts.label};
    color: ${props => props.theme.colors.black};
    margin-bottom: 4px;
  }

  a {
    font: ${props => props.theme.fonts.signOut};
    color: ${props => props.theme.colors.red};
  }
`;
