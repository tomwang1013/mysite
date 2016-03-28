import express     from 'express';
import logger      from 'morgan';
import bodyParser  from 'body-parser';
import favicon     from 'serve-favicon';
import mongoose    from 'mongoose';

import signupHandler from './controllers/user'
import errorHandler from './controllers/error'
import serv_render from './middlewares/render';

mongoose.connect('mongodb://localhost/mysite');

const app = express();

app.set('views', '../dest/views')
app.set('view engine', 'jade')

app.use(logger('dev'));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signup', signupHandler);
app.all(serv_render);
app.use(errorHandler);

app.listen(3000, function() {
  console.log('server started and listen on 3000...');
});
