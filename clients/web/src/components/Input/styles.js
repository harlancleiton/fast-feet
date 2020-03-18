import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.white};

  & + div,
  & + button {
    margin-top: 15px;
  }

  label {
    font: ${props => props.theme.fonts.label};
    color: ${props => props.theme.colors.black};
    line-height: 19px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  input {
    border-radius: 4px;
    border: ${props => `solid 1px ${props.theme.colors.gray}`};
    width: 270px;
    height: 45px;
    padding: 0 15px;

    &::placeholder {
      font: ${props => props.theme.fonts.placeholder};
      line-height: 21px;
      color: ${props => props.theme.colors.gray2};
    }
  }
`;

export const Error = styled.span`
  color: ${props => props.theme.colors.red};
  margin-top: 4px;
`;
