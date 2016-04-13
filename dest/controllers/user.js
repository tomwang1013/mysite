'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginHandler = exports.signupHandler = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VALID_EMAIL_REG = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/;
var SALT_ROUNDS = 10;

function signupHandler(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty' });
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email' });
  }

  _bcrypt2.default.hash(password, SALT_ROUNDS, function (err, hash) {
    var u = new _user2.default({ email: email, password: hash });

    u.save(function (err, nu) {
      if (err) {
        return res.json({ error: 1, message: 'signup failed, please try again later' });
      }

      res.json({ error: 0, redirect_url: '/login' });
    });
  });
}

function loginHandler(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty' });
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email' });
  }

  _user2.default.findOne({ email: email }, function (err, user) {
    if (!user) {
      return res.json({ error: 1, message: 'user not exist' });
    }

    _bcrypt2.default.compare(password, user.password, function (err, match) {
      if (match) {
        return res.json({ error: 0 });
      } else {
        return res.json({ error: 1, message: 'user and password not match' });
      }
    });
  });
}

exports.signupHandler = signupHandler;
exports.loginHandler = loginHandler;