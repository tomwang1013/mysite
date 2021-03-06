const path          = require('path');
const express       = require('express');
const subdomain     = require('express-subdomain');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const flash         = require('connect-flash');
const _             = require('lodash');
const favicon       = require('serve-favicon');
const app           = express();

global.app          = app;
global.gRoot        = __dirname;
global.gConfig      = _.merge({},
  require('./config/settings'),
  require('./config/settings.local')
);
global.gControllers = require('./controllers');
global.gModels      = require('./models');

app.set('x-powered-by', false);
app.set('trust proxy', true);
app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('dev'));

if (app.get('env') === 'development') {
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static('public'));
}

app.use(cookieParser());  // for req.cookies or signedCookies
app.use(gControllers.middlewares.session);  // for req.session
app.use(flash()); // for req.flash(name[, value]), must behind session middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(gControllers.middlewares.currentUser);

app.use(function(req, res, next) {
  res.locals.req = req;
  next();
});

app.use(subdomain('api', require('./route/api')));
app.use(require('./route'));
app.use(gControllers.error);

// js和css文件名映射
if (app.get('env') === 'production') {
  app.assetsManifest = require('./public/assets/rev-manifest.json');
}

app.locals.assetHashPath = function(originPath) {
  if (app.get('env') === 'development') {
    return `${gConfig.assets_host}/assets/${originPath}`;
  } else {
    return `${gConfig.assets_host}/assets/${app.assetsManifest[originPath]}`;
  }
};

// 从当前请求得到分页的url
const querystring = require('querystring');
app.locals.createPageUrl = function(req, page) {
  req.query.page = page;

  return `${req.baseUrl}${req.path}?${querystring.stringify(req.query)}`; 
};

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
