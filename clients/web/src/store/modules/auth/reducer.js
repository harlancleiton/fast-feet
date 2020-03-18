import produce from 'immer';

const INITIAL_STATE = {
  loading: false,
  token: null,
  signed: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    const nextState = draft;

    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST':
        nextState.loading = true;
        break;
      case '@auth/SIGN_IN_SUCCESS':
        nextState.token = action.payload.token;
        nextState.signed = true;
        nextState.loading = false;
        break;
      case '@auth/SIGN_IN_FAILURE':
        nextState.loading = false;
        break;
      default:
    }

    return nextState;
  });
}
