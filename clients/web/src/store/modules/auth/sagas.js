import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import { signInSuccess } from './actions';

function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });

    const { token, user } = response.data;

    yield put(signInSuccess(token, user));

    history.push('/deliveries');
  } catch (error) {
    if (error.response) {
      const { response } = error;

      if (response.status === 401)
        toast.error('Falha na autenticação, verifique suas credencias');
      else toast.error('Ocorreu um erro inesperado');
    } else {
      toast.error('Ocorreu um erro inesperado');
    }
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
