'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _user = require('./controllers/user');

var user = _interopRequireWildcard(_user);

var _error = require('./controllers/error');

var _error2 = _interopRequireDefault(_error);

var _render = require('./middlewares/render');

var _render2 = _interopRequireDefault(_render);

var _current_user = require('./middlewares/current_user');

var _current_user2 = _interopRequireDefault(_current_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect('mongodb://localhost/mysite');

var app = (0, _express2.default)();
var MongoStore = require('connect-mongo')(_expressSession2.default);

app.set('views', __dirname + '/../dest/views');
app.set('view engine', 'jade');

app.use((0, _morgan2.default)('dev'));
app.use((0, _serveFavicon2.default)(__dirname + '/../public/favicon.ico'));
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({
  secret: 'xiongwang',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: _mongoose2.default.connection })
}));
app.use(_current_user2.default);

// ajax
app.post('/signup', user.signupHandler);
app.post('/login', user.loginHandler);

// render page
app.get('/', _render2.default);
app.get('/signup', _render2.default);
app.get('/login', _render2.default);

app.use(_error2.default);

app.listen(3000, function () {
  console.log('server started and listen on 3000...');
});