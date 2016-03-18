'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res) {
  (0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      var content = (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, renderProps));
      var page = _jade2.default.renderFile(__dirname + '/../views/index.jade', { content: content });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found');
    }
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