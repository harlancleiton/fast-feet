import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';
import theme from './styles/theme';
import GlobalStyle from './styles/global';
import { store, persistor } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <Routes />
            <ToastContainer autoClose={4000} />
            <GlobalStyle />
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}
