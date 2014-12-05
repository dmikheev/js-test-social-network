var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var config = require('./libs/config');
var routes = require('./routes');
var passportHelper = require('./libs/passportHelper');

mongoose.connect(config.get('db:host'), config.get('db:name'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
  console.log('Connected to DB');
});

passportHelper.init();

var app = express();

app.configure(function() {
  app.use(express.cookieParser);
  app.use(express.bodyParser);
  app.use(express.session({ secret: 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});
//app.use(express.static('public'));

var handlers = require('./handlers/main');

routes.setup(app, handlers, passportHelper.ensureAuthenticated);
app.listen(config.get('port'));