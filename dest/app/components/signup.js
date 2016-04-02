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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Signup = function (_React$Component) {
  _inherits(Signup, _React$Component);

  function Signup(props) {
    _classCallCheck(this, Signup);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Signup).call(this, props));

    _this.state = {
      email: '',
      password: '',
      isEmailValid: true,
      emailHint: ''
    };
    return _this;
  }

  _createClass(Signup, [{
    key: 'submitHandler',
    value: function submitHandler(event) {
      event.preventDefault();

      $.post('/signup', this.state, function (data) {
        location.assign(data.url);
      });
    }

    // check if this email is valid

  }, {
    key: 'emailChecker',
    value: function emailChecker(event) {
      $.get('/email_check', { email: this.state.email }, function (data) {
        if (data.error) {
          this.setState({
            isEmailValid: false,
            emailHint: 'user already exists'
          });
        } else {
          this.setState({
            isEmailValid: true,
            emailHint: 'you can use this email'
          });
        }
      }.bind(this));
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
              { onSubmit: this.submitHandler.bind(this) },
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
                  onBlur: this.emailChecker.bind(this),
                  onChange: this.handleChange.bind(this)
                }),
                _react2.default.createElement(
                  'div',
                  {
                    style: this.state.isEmailValid ? { display: 'none' } : { display: 'block' },
                    className: this.state.isEmailValid ? 'alert alert-success' : 'alert alert-warning'
                  },
                  this.state.emailHint
                )
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
                'button',
                { type: 'submit', className: 'btn btn-primary' },
                '注册'
              )
            )
          )
        )
      );
    }
  }]);

  return Signup;
}(_react2.default.Component);

exports.default = Signup;