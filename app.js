var express     = require('express');
var app         = express();
var logger      = require('morgan');
var bodyParser  = require('body-parser')
var favicon     = require('serve-favicon');
var serv_render = require('./middleware/render-babeled.js');

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', serv_render.default);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
