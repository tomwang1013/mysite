var express     = require('express');
var app         = express();
var logger      = require('morgan');
var bodyParser  = require('body-parser')
var favicon     = require('serve-favicon');

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', function(req, res, next) {
  res.send('Hello, World!');
});

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
