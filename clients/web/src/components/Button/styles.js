import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.button`
  background: ${props => props.theme.colors.primary};
  border-radius: 4px;
  border: 0px transparent;
  color: ${props => props.theme.colors.white};
  font: ${props => props.theme.fonts.button};
  line-height: 21px;

  &:hover {
    background: ${props => darken(0.03, props.theme.colors.primary)};
  }
`;
