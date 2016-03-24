import express     from 'express';
import logger      from 'morgan';
import bodyParser  from 'body-parser';
import favicon     from 'serve-favicon';
import mongoose    from 'mongoose';

import serv_render from './middlewares/render';

mongoose.connect('mongodb://localhost/mysite');

const app = express();

app.use(logger('dev'));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import signupHandler from './controllers/user'
import errorHandler from './controllers/error'
app.post('/signup', signupHandler);

app.use(errorHandler);

app.use(serv_render);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
