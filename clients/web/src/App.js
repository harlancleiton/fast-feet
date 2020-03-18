import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'normalize.css';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';
import theme from './styles/theme';
import GlobalStyle from './styles/global';

export default function App() {
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Routes />
        <GlobalStyle />
      </ThemeProvider>
    </Router>
  );
}
