'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../actions/index');

var initialState = {
  isLogin: false,
  loginEmail: ''
};

function mysiteApp() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _index.USER_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        loginEmail: action.loginEmail
      });
    default:
      return state;
  }
}

exports.default = mysiteApp;