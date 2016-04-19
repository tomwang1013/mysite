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
      var store = (0, _redux.createStore)(_reducers2.default);

      if (req.currentUser) {
        store.dispatch((0, _actions.userLogin)(req.currentUser.email));
      }

      return res.render('index', {
        content: (0, _server.renderToString)(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(_reactRouter.RouterContext, renderProps)
        )),
        initialState: store.getState()
      });
    }

    next(new Error('no route match'));
  });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _routes = require('../app/routes');

var _routes2 = _interopRequireDefault(_routes);

var _reducers = require('../app/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _actions = require('../app/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;