import express     from 'express';
import logger      from 'morgan';
import bodyParser  from 'body-parser';
import favicon     from 'serve-favicon';
import mongoose    from 'mongoose';
import session     from 'express-session';

import * as user from './controllers/user'
import errorHandler from './controllers/error'
import servRender from './middlewares/render';
import currentUser from './middlewares/current_user';

mongoose.connect('mongodb://localhost/mysite');

const app        = express();
const MongoStore = require('connect-mongo')(session);

app.set('views', __dirname + '/../dest/views')
app.set('view engine', 'jade')

app.use(logger('dev'));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret:            'xiongwang',
  resave:            false,
  saveUninitialized: false,
  store:             new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(currentUser);

// ajax
app.post('/signup', user.signupHandler);
app.post('/login',  user.loginHandler);

// render page
app.get('/', servRender);
app.get('/signup', servRender);
app.get('/login', servRender);

app.use(errorHandler);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
