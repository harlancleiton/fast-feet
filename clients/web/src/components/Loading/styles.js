import styled from 'styled-components';
import { lighten } from 'polished';
import BounceLoader from 'react-spinners/BounceLoader';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Loader = styled(BounceLoader).attrs(props => ({
  color: lighten(0.2, props.theme.colors.primary),
}))``;
