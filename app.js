'use strict';

const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const favicon       = require('serve-favicon');
const flash         = require('connect-flash');
const _             = require('lodash');
const app           = express();

global.gRoot        = __dirname;
global.gConfig      = _.merge({},
  require('./config/settings'),
  require('./config/settings.local')
);
global.gControllers = require('./controllers');
global.gModels      = require('./models');

app.set('views', './views')
app.set('view engine', 'pug')

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(gControllers.middlewares.getReq);
app.use(gControllers.middlewares.session);
app.use(flash());
app.use(gControllers.middlewares.currentUser);

app.use(require('./route'));
app.use(gControllers.error);

app.assetsManifest = require('./rev-manifest.json');
app.locals.assetHashPath = function(originPath) {
  if (app.get('env') == 'development') {
    return '/' + originPath;
  } else {
    return '/' + app.assetsManifest[originPath];
  }
}

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
