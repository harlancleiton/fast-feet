import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import 'normalize.css';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';
import theme from './styles/theme';
import GlobalStyle from './styles/global';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Routes />
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </Provider>
  );
}
