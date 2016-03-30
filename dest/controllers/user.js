'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emailChecker = exports.signupHandler = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signupHandler(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  var u = new _user2.default({ email: email, password: password });

  u.save(function (err, nu) {
    if (err) return next(err);

    res.json({ status: 0, url: '/login' });
  });
}

function emailChecker(req, res, next) {
  var email = req.query.email;

  _user2.default.findOne({ 'email': email }, function (err, result) {
    res.json({ error: !!result });
  });
}

exports.signupHandler = signupHandler;
exports.emailChecker = emailChecker;