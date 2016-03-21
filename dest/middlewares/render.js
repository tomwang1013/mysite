'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res) {
  var content = (0, _server.renderToString)(_react2.default.createElement(_app2.default, null));
  var page = _jade2.default.renderFile(__dirname + '/../views/index.jade', { content: content });

  res.send(page);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _app = require('../app/components/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;