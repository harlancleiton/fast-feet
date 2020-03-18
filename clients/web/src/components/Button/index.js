// TODO eslint fix
/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../Loading';
import { Container } from './styles';

export default function Button({ loading, children, ...rest }) {
  return (
    <Container disabled={loading} {...rest}>
      {!loading ? <span>{children}</span> : <Loading />}
    </Container>
  );
}

Button.propTypes = {
  children: PropTypes.elementType.isRequired,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  loading: false,
};
