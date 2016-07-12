'use strict';

const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const favicon       = require('serve-favicon');

global.app          = express();
global.gControllers = require('./controllers');
global.gModels      = require('./models');
global.root         = __dirname;

app.set('views', './views')
app.set('view engine', 'pug')

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(gControllers.middlewares.getReq);
app.use(gControllers.middlewares.session);
app.use(gControllers.middlewares.currentUser);

app.use(require('./route'));
app.use(gControllers.error);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
