import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'normalize.css';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';
import theme from './styles/theme';

export default function App() {
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </Router>
  );
}
