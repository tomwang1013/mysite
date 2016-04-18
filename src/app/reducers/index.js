import { USER_LOGIN } from '../actions/index'

const initialState = {
  isLogin: false,
  loginEmail: ''
};

function mysiteApp(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        loginEmail: action.loginEmail
      });
    default:
      return state;
  }
}

export default mysiteApp;
