/**
 * Основной модуль сервера
 */

import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { CLIENT_PATH } from './constants/constants';
import errorHandler from './errorHandler';
import config from './libs/config';
import * as passportHelper from './libs/passportHelper';
import * as routes from './routes';

mongoose.Promise = Promise;
mongoose.connect(`mongodb://${config.get('db:host')}:${config.get('db:port')}/${config.get('db:name')}`, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
  console.log('Connected to DB');
});
mongoose.Error.messages.general.required = 'Field "{PATH}" id required.';

passportHelper.init();

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.get('session_secret_key'),
}));
app.use(passport.initialize());
app.use(passport.session());

routes.setup(app);
app.use(express.static(CLIENT_PATH));
routes.setupHistoryApiFallback(app);

app.use(errorHandler);

app.listen(config.get('port'));
