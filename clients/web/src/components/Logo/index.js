import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../assets/logo.png';

export default function Logo({ width, height }) {
  return <img width={width} height={height} src={logo} alt="FastFeet" />;
}

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

Logo.defaultProps = {
  width: 260,
  height: 44,
};
