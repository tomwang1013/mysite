'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {
  (0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (error, redirectLocation, renderProps) {
    if (error) {
      return next(error);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (renderProps) {
      renderProps = Object.assign(renderProps, {
        isLogin: !!req.session.email,
        email: req.session.email
      });

      return res.render('index', {
        content: (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, renderProps))
      });
    }

    next(new Error('no route match'));
  });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _routes = require('../app/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;