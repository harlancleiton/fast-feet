import styled from 'styled-components';

import Button from '../../components/Button';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props => props.theme.colors.primary};

  form {
    margin-top: 45px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 40px;
  padding: 60px 30px;
  background: ${props => props.theme.colors.white};
  width: 360px;
  border-radius: 4px;
`;

export const SubmitButton = styled(Button)`
  height: 45px;
  width: 300px;
`;
