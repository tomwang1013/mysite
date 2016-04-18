'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userLogin = userLogin;
var USER_LOGIN = exports.USER_LOGIN = 'USER_LOGIN';

function userLogin(loginEmail) {
  return { type: USER_LOGIN, loginEmail: loginEmail };
}