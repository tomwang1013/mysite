'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _app = require('./components/app');

var _app2 = _interopRequireDefault(_app);

var _home = require('./components/home');

var _home2 = _interopRequireDefault(_home);

var _login = require('./components/login');

var _login2 = _interopRequireDefault(_login);

var _signup = require('./components/signup');

var _signup2 = _interopRequireDefault(_signup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
  _reactRouter.Route,
  { path: '/', component: _app2.default },
  _react2.default.createElement(_reactRouter.IndexRoute, { component: _home2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _login2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _signup2.default })
);