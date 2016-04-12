import express     from 'express';
import logger      from 'morgan';
import bodyParser  from 'body-parser';
import favicon     from 'serve-favicon';
import mongoose    from 'mongoose';

import * as user from './controllers/user'
import errorHandler from './controllers/error'
import serv_render from './middlewares/render';

mongoose.connect('mongodb://localhost/mysite');

const app = express();

app.set('views', __dirname + '/../dest/views')
app.set('view engine', 'jade')

app.use(logger('dev'));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ajax
app.post('/signup', user.signupHandler);
app.post('/login', user.loginHandler);

// render page
app.get('/', serv_render);
app.get('/signup', serv_render);
app.get('/login', serv_render);
app.use(errorHandler);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
