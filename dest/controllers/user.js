'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginHandler = exports.signupHandler = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signupHandler(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var validEmailReg = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty' });
  }

  if (!validEmailReg.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email' });
  }

  var u = new _user2.default({ email: email, password: password });

  u.save(function (err, nu) {
    if (err) {
      return res.json({ error: 1, message: 'signup failed, please try again later' });
    }

    res.json({ error: 0, redirect_url: '/login' });
  });
}

function loginHandler(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var validEmailReg = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty' });
  }

  if (!validEmailReg.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email' });
  }

  // TODO authentication
}

exports.signupHandler = signupHandler;
exports.loginHandler = loginHandler;