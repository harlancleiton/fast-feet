import React from 'react';

import { Container, Loader } from './styles';

export default function Loading() {
  return (
    <Container>
      <Loader size={24} />
    </Container>
  );
}
