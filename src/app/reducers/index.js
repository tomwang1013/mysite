import { USER_LOGIN, USER_LOGOUT } from '../actions/index'

const initialState = {
  isLogin: false,
  loginEmail: '',
  userType: ''
};

function mysiteApp(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        loginEmail: action.loginEmail,
        userType: action.userType
      });
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default mysiteApp;
