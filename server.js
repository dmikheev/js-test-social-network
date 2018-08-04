/**
 * Основной модуль сервера
 */

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

var config = require('./libs/config');
var routes = require('./routes');
var passportHelper = require('./libs/passportHelper');
var errorHandler = require('./errorHandler');

mongoose.Promise = Promise;
mongoose.connect(`mongodb://${config.get('db:host')}:${config.get('db:port')}/${config.get('db:name')}`, {
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
  console.log('Connected to DB');
});
mongoose.Error.messages.general.required = 'Field "{PATH}" id required.';

passportHelper.init();

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.get('session_secret_key')
}));
app.use(passport.initialize());
app.use(passport.session());

var handlers = require('./handlers/main');

routes.setup(app, handlers, passportHelper.ensureAuthenticated);
app.use(express.static('client/dist'));

app.use(errorHandler);

app.listen(config.get('port'));
