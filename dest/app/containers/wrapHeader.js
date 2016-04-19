'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _header = require('../components/header');

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    isLogin: state.isLogin,
    loginEmail: state.loginEmail
  };
};

var WrapHeader = (0, _reactRedux.connect)(mapStateToProps)(_header2.default);

exports.default = WrapHeader;