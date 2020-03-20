import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    const nextState = draft;

    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS':
        nextState.profile = action.payload.user;
        break;
      case '@auth/SING_OUT':
        nextState.profile = null;
        break;
      default:
    }

    return nextState;
  });
}
