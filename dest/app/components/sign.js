'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * signup and login
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Sign = function (_React$Component) {
  _inherits(Sign, _React$Component);

  function Sign(props) {
    _classCallCheck(this, Sign);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sign).call(this, props));

    _this.state = {
      email: '',
      password: '',
      message: '', // message if signup or login failed
      alertKlass: 'alert alert-success',
      alertStyle: { display: 'none' },
      submitUrl: _this.props.location.pathname,
      submitText: _this.props.location.pathname == '/signup' ? '注册' : '登陆'
    };
    return _this;
  }

  _createClass(Sign, [{
    key: 'submitHandler',
    value: function submitHandler(event) {
      event.preventDefault();

      var that = this;

      $.post(this.state.submitUrl, this.state, function (data) {
        if (data.error) {
          that.setState({
            message: data.message,
            alertKlass: 'alert alert-warning',
            alertStyle: { display: 'block' }
          });
        } else {
          that.setState({
            message: '',
            alertKlass: 'alert alert-success',
            alertStyle: { display: 'none' }
          });

          // TODO how to pass props to new router component?
          if (that.props.location.pathname == '/signup') {
            that.context.router.push(data.redirect_url);
          } else {
            that.context.router.push('/');
          }
        }
      });
    }

    // change input value

  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState(_defineProperty({}, event.target.name, event.target.value));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'div',
          { className: 'row' },
          _react2.default.createElement(
            'div',
            { className: 'col-lg-6 col-lg-offset-3' },
            _react2.default.createElement(
              'form',
              { method: 'post', onSubmit: this.submitHandler.bind(this) },
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'email' },
                  'Email address'
                ),
                _react2.default.createElement('input', {
                  type: 'email',
                  name: 'email',
                  className: 'form-control',
                  value: this.state.email,
                  onChange: this.handleChange.bind(this)
                })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'password' },
                  'Password'
                ),
                _react2.default.createElement('input', {
                  type: 'password',
                  name: 'password',
                  className: 'form-control',
                  value: this.state.password,
                  onChange: this.handleChange.bind(this)
                })
              ),
              _react2.default.createElement(
                'div',
                { className: this.state.alertKlass, style: this.state.alertStyle },
                this.state.message
              ),
              _react2.default.createElement(
                'button',
                { type: 'submit', className: 'btn btn-primary' },
                this.state.submitText
              )
            )
          )
        )
      );
    }
  }]);

  return Sign;
}(_react2.default.Component);

Sign.contextTypes = {
  router: _react2.default.PropTypes.object
};

exports.default = Sign;